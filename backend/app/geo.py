"""Optional city/country lookup for a visitor's IP address.

Off by default: turning it on sends visitor IPs to a third-party service, which
is a privacy decision the site owner should make deliberately. Set
GEO_LOOKUP_ENABLED=true to fill the City / Region / Country / ISP columns of the
chat log; leave it off and those columns stay blank unless the hosting proxy
already supplies the headers.
"""

import ipaddress
import logging
import os
from typing import Any

import httpx

logger = logging.getLogger("ai-portfolio.geo")

# ip-api.com's free tier: no key, ~45 lookups/minute, HTTP only.
_ENDPOINT = "http://ip-api.com/json/{ip}?fields=status,country,regionName,city,isp"

EMPTY: dict[str, str] = {"country": "", "region": "", "city": "", "isp": ""}


class GeoLookup:
    """IP -> coarse location, cached so repeat visitors cost nothing."""

    def __init__(self, enabled: bool | None = None, cache_size: int = 2048) -> None:
        self.enabled = (
            os.getenv("GEO_LOOKUP_ENABLED", "false").strip().lower() in {"1", "true", "yes"}
            if enabled is None
            else enabled
        )
        self._cache: dict[str, dict[str, str]] = {}
        self._cache_size = cache_size
        self._client: httpx.AsyncClient | None = None

    async def lookup(self, ip: str) -> dict[str, str]:
        if not self.enabled or not _is_public(ip):
            return dict(EMPTY)
        if ip in self._cache:
            return dict(self._cache[ip])

        try:
            if self._client is None:
                self._client = httpx.AsyncClient(timeout=4.0)
            response = await self._client.get(_ENDPOINT.format(ip=ip))
            payload: dict[str, Any] = response.json()
        except Exception:  # noqa: BLE001 — geo is a nicety, never a failure path
            logger.debug("Geo lookup failed for %s", ip, exc_info=True)
            return dict(EMPTY)

        if payload.get("status") != "success":
            return dict(EMPTY)

        result = {
            "country": payload.get("country", "") or "",
            "region": payload.get("regionName", "") or "",
            "city": payload.get("city", "") or "",
            "isp": payload.get("isp", "") or "",
        }

        if len(self._cache) >= self._cache_size:
            self._cache.clear()
        self._cache[ip] = result
        return dict(result)

    async def aclose(self) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None


def _is_public(ip: str) -> bool:
    try:
        address = ipaddress.ip_address(ip)
    except ValueError:
        return False
    return not (address.is_private or address.is_loopback or address.is_reserved)
