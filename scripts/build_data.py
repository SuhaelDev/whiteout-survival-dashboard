#!/usr/bin/env python3
"""Build normalized Whiteout Survival dashboard data from the seed extraction."""

from __future__ import annotations

import json
import math
import re
import shutil
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path("/Users/suhaelsmacbook/Downloads")
SEED_PATH = DOWNLOADS / "whiteout_survival_seed_extract.json"
DATA_DIR = ROOT / "data"
SOURCE_DIR = DATA_DIR / "source"


BUILDING_SHEETS = [
    "Furnace",
    "Barricade",
    "Command Center",
    "Coal Mine",
    "Embassy",
    "Infirmary",
    "Hunter's Hut",
    "Infantry Camp",
    "Iron Mine",
    "Lancer Camp",
    "Marksman Camp",
    "Research Center",
    "Sawmill",
    "Shelter",
    "War Academy",
]

CHIEF_GEAR_SLOTS = ["Hat", "Watch", "Coat", "Pants", "Ring", "Cudgel"]
CHARM_PARENTS = ["Hat", "Coat", "Ring", "Watch", "Pants", "Cudgel"]
CHARM_POSITIONS = ["Top", "Left", "Right"]
TROOP_TYPES = ["Infantry", "Lancer", "Marksman"]
EXPERT_SHEETS = [
    "Cyrille",
    "Agnes",
    "Holger",
    "Romulus",
    "Fabian",
    "Baldur",
    "Valeria",
    "Ronne",
    "Kathy",
]

RESOURCE_TYPES = [
    ("meat", "Meat", "basic_resource", "quantity"),
    ("wood", "Wood", "basic_resource", "quantity"),
    ("coal", "Coal", "basic_resource", "quantity"),
    ("iron", "Iron", "basic_resource", "quantity"),
    ("fire_crystals", "Fire Crystals", "crystal", "quantity"),
    ("refined_fire_crystals", "Refined Fire Crystals", "crystal", "quantity"),
    ("steel", "Steel", "war_academy", "quantity"),
    ("fire_crystal_shards", "Fire Crystal Shards", "war_academy", "quantity"),
    ("hardened_alloy", "Hardened Alloy", "chief_gear", "quantity"),
    ("polishing_solution", "Polishing Solution", "chief_gear", "quantity"),
    ("design_plans", "Design Plans", "chief_gear", "quantity"),
    ("lunar_amber", "Lunar Amber", "chief_gear", "quantity"),
    ("charm_guides", "Charm Guides", "chief_charms", "quantity"),
    ("charm_designs", "Charm Designs", "chief_charms", "quantity"),
    ("charm_secrets", "Charm Secrets", "chief_charms", "quantity"),
    ("mythic_general_shards", "Mythic General Shards", "heroes", "quantity"),
    ("epic_general_shards", "Epic General Shards", "heroes", "quantity"),
    ("rare_general_shards", "Rare General Shards", "heroes", "quantity"),
    ("hero_gear_xp", "Hero Gear XP", "hero_gear", "quantity"),
    ("mythic_gear", "Mythic Gear", "hero_gear", "quantity"),
    ("mithril", "Mithril", "hero_gear", "quantity"),
    ("essence_stones", "Essence Stones", "hero_gear", "quantity"),
    ("pet_food", "Pet Food", "pets", "quantity"),
    ("pet_manuals", "Taming Manual", "pets", "quantity"),
    ("pet_potions", "Energizing Potion", "pets", "quantity"),
    ("pet_serum", "Strengthening Serum", "pets", "quantity"),
    ("common_sigils", "Common Expert Sigils", "experts", "quantity"),
    ("books_of_knowledge", "Books of Knowledge", "experts", "quantity"),
    ("learning_speedups_minutes", "Learning Speedups", "speedups", "minutes"),
    ("construction_speedups_minutes", "Construction Speedups", "speedups", "minutes"),
    ("research_speedups_minutes", "Research Speedups", "speedups", "minutes"),
    ("training_speedups_minutes", "Training Speedups", "speedups", "minutes"),
    ("general_speedups_minutes", "General Speedups", "speedups", "minutes"),
]

WEB_SOURCES = [
    {
        "source_id": "google_play_current",
        "label": "Google Play Whiteout Survival current listing",
        "url": "https://play.google.com/store/apps/details?hl=en_US&id=com.gof.global",
        "retrieved_at": "2026-07-04",
        "notes": "Updated on Jun 17, 2026. Current What is new includes Flame Tech, Icefire Warhymn League, Collection Gallery, and Mine Leader Kathy.",
    },
    {
        "source_id": "apple_app_store_version_history",
        "label": "Apple App Store Whiteout Survival version history",
        "url": "https://apps.apple.com/gy/app/whiteout-survival/id6443575749",
        "retrieved_at": "2026-07-04",
        "notes": "Version history includes Ronne in version 1.31.20 on Apr 15 and current release notes matching Google Play.",
    },
    {
        "source_id": "bluestacks_research_center_2026",
        "label": "BlueStacks Research Center guide",
        "url": "https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-research-center-guide-en.html",
        "retrieved_at": "2026-07-04",
        "notes": "Research Center unlock, resource families, and Growth/Economy/Battle tree coverage. Posted Mar 23, 2026.",
    },
    {
        "source_id": "bluestacks_war_academy_2026",
        "label": "BlueStacks War Academy guide",
        "url": "https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-troops-upgrade-guide-en.html",
        "retrieved_at": "2026-07-04",
        "notes": "War Academy timeline, FC5 gate, Helios branches, Fire Crystal Shards, and approximate one-troop-type totals.",
    },
    {
        "source_id": "ajackof_war_academy",
        "label": "A Jack Of War Academy guide",
        "url": "https://www.ajackof.com/games/whiteout-survival-wos/whiteout-survival-war-academy/",
        "retrieved_at": "2026-07-04",
        "notes": "Community table for War Academy FC costs, shard exchange, branch priority, and per-troop-type costs.",
    },
    {
        "source_id": "outofgames_experts",
        "label": "Out of Games Experts guide",
        "url": "https://outof.games/realms/whiteoutsurvival/guides/497-what-are-experts-in-whiteout-survival/",
        "retrieved_at": "2026-07-04",
        "notes": "Expert mechanics, Dawn Academy, skill learning, affinity, relationship levels, and Kathy release note.",
    },
    {
        "source_id": "whiteout_wiki_chief_gear_stats",
        "label": "Whiteout Survival Wiki Chief Gear and Chief Charm tables",
        "url": "https://www.whiteoutsurvival.wiki/chief-gear/chief-gear/",
        "retrieved_at": "2026-07-05",
        "notes": "Chief gear slot stat mapping, chief gear stat totals, troop deployment capacity, and charm stat totals. Used for exact attribute deltas where the workbook only exposes costs and power.",
    },
]

CHIEF_GEAR_STAT_ANCHORS = [
    ("Locked", 0.0, 0),
    ("Uncommon", 9.35, 0),
    ("Uncommon (1-Star)", 12.75, 0),
    ("Rare", 17.0, 0),
    ("Rare (1-Star)", 21.25, 0),
    ("Rare (2-Star)", 25.5, 0),
    ("Rare (3-Star)", 29.75, 0),
    ("Epic", 34.0, 0),
    ("Epic (1-Star)", 36.89, 0),
    ("Epic (2-Star)", 39.78, 0),
    ("Epic (3-Star)", 42.67, 0),
    ("Epic T1", 45.56, 0),
    ("Epic T1 (1-Star)", 48.45, 0),
    ("Epic T1 (2-Star)", 51.34, 0),
    ("Epic T1 (3-Star)", 54.23, 0),
    ("Mythic", 56.78, 0),
    ("Mythic (1-Star)", 59.33, 0),
    ("Mythic (2-Star)", 61.88, 0),
    ("Mythic (3-Star)", 64.43, 0),
    ("Mythic T1", 66.98, 0),
    ("Mythic T1 (1-Star)", 69.53, 0),
    ("Mythic T1 (2-Star)", 72.08, 0),
    ("Mythic T1 (3-Star)", 74.63, 0),
    ("Mythic T2", 77.18, 0),
    ("Mythic T2 (1-Star)", 79.73, 0),
    ("Mythic T2 (2-Star)", 82.28, 0),
    ("Mythic T2 (3-Star)", 85.0, 0),
    ("Legendary", 89.25, 40),
    ("Legendary (1-Star)", 93.5, 80),
    ("Legendary (2-Star)", 97.75, 120),
    ("Legendary (3-Star)", 102.0, 160),
    ("Legendary T1", 106.25, 290),
    ("Legendary T1 (1-Star)", 110.5, 330),
    ("Legendary T1 (2-Star)", 114.75, 370),
    ("Legendary T1 (3-Star)", 119.0, 410),
    ("Legendary T2", 123.25, 540),
    ("Legendary T2 (1-Star)", 127.5, 580),
    ("Legendary T2 (2-Star)", 131.75, 620),
    ("Legendary T2 (3-Star)", 136.0, 660),
    ("Legendary T3", 140.25, 790),
    ("Legendary T3 (1-Star)", 144.5, 830),
    ("Legendary T3 (2-Star)", 148.75, 870),
    ("Legendary T3 (3-Star)", 153.0, 910),
    ("Legendary T4", 161.5, 1050),
    ("Legendary T4 (1-Star)", 170.0, 1100),
    ("Legendary T4 (2-Star)", 178.5, 1150),
    ("Legendary T4 (3-Star)", 187.0, 1200),
]

CHIEF_CHARM_STAT_PERCENT = {
    0: 0.0,
    1: 9.0,
    2: 12.0,
    3: 16.0,
    4: 19.0,
    5: 25.0,
    6: 30.0,
    7: 35.0,
    8: 40.0,
    9: 45.0,
    10: 50.0,
    11: 55.0,
    12: 64.0,
    13: 73.0,
    14: 82.0,
    15: 91.0,
    16: 100.0,
}


def slug(value: Any) -> str:
    text = str(value).strip().lower()
    text = text.replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return re.sub(r"_+", "_", text).strip("_")


def value_at(row: list[Any], index: int) -> Any:
    if index < 0 or index >= len(row):
        return None
    value = row[index]
    if value in ("", "-", "—", "#N/A", "#REF!", "#VALUE!", "#DIV/0!"):
        return None
    return value


def numeric(value: Any, default: float | int = 0) -> float | int:
    value = value_at([value], 0)
    if value is None:
        return default
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        clean = value.replace(",", "").strip()
        try:
            return float(clean)
        except ValueError:
            return default
    return default


def truncate_decimal(value: float, decimals: int = 2) -> float:
    factor = 10**decimals
    return math.trunc(float(value) * factor) / factor


def text_or_none(value: Any) -> str | None:
    value = value_at([value], 0)
    if value is None:
        return None
    return str(value).strip()


def rows(seed: dict[str, Any], sheet_name: str) -> list[list[Any]]:
    return seed["raw_sheets"][sheet_name]["values"]


def extract_buildings(seed: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    buildings: list[dict[str, Any]] = []
    levels: list[dict[str, Any]] = []
    prerequisites: list[dict[str, Any]] = []

    for sheet_name in BUILDING_SHEETS:
        sheet_rows = rows(seed, sheet_name)
        building_id = slug(sheet_name)
        buildings.append(
            {
                "building_id": building_id,
                "name": sheet_name,
                "source_sheet": sheet_name,
                "category": "construction",
            }
        )

        prereq_headers: list[tuple[int, str]] = []
        header_row = sheet_rows[3] if len(sheet_rows) > 3 else []
        for col_idx in range(23, len(header_row)):
            header = text_or_none(header_row[col_idx])
            if header:
                prereq_headers.append((col_idx, header))

        for row_idx, row in enumerate(sheet_rows[5:], start=6):
            level_code = text_or_none(value_at(row, 1))
            if not level_code or level_code.lower() == "total":
                continue
            if level_code.startswith("#"):
                continue

            level = {
                "building_id": building_id,
                "level_code": level_code,
                "numerical_level": numeric(value_at(row, 2), None),
                "meat": numeric(value_at(row, 3)),
                "wood": numeric(value_at(row, 5)),
                "coal": numeric(value_at(row, 7)),
                "iron": numeric(value_at(row, 9)),
                "fire_crystals": numeric(value_at(row, 11)),
                "refined_fire_crystals": numeric(value_at(row, 13)),
                "build_seconds": numeric(value_at(row, 20)),
                "source_sheet": sheet_name,
                "source_row": row_idx,
            }
            levels.append(level)

            for col_idx, prereq_name in prereq_headers:
                prereq_level = text_or_none(value_at(row, col_idx))
                if prereq_level:
                    prerequisites.append(
                        {
                            "building_id": building_id,
                            "level_code": level_code,
                            "prereq_building_id": slug(prereq_name),
                            "prereq_building_name": prereq_name,
                            "prereq_level_code": prereq_level,
                            "source_sheet": sheet_name,
                            "source_row": row_idx,
                        }
                    )

    return buildings, levels, prerequisites


def extract_chief_gear(seed: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for row_idx, row in enumerate(rows(seed, "New Chief Gear Data")[3:115], start=4):
        level_code = text_or_none(value_at(row, 3))
        sequence = numeric(value_at(row, 4), None)
        if not level_code or sequence is None:
            continue
        out.append(
            {
                "gear_level_code": level_code,
                "sequence": sequence,
                "alloy": numeric(value_at(row, 5)),
                "polish": numeric(value_at(row, 6)),
                "design_plans": numeric(value_at(row, 7)),
                "amber": numeric(value_at(row, 8)),
                "power": numeric(value_at(row, 9)),
                "svs_points": numeric(value_at(row, 10)),
                "source_sheet": "New Chief Gear Data",
                "source_row": row_idx,
            }
        )
    return out


def extract_charm_levels(seed: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for row_idx, row in enumerate(rows(seed, "Charms Data")[3:], start=4):
        level = numeric(value_at(row, 1), None)
        if level is None:
            continue
        out.append(
            {
                "charm_level": level,
                "guides": numeric(value_at(row, 2)),
                "designs": numeric(value_at(row, 3)),
                "secrets": numeric(value_at(row, 4)),
                "power": numeric(value_at(row, 5)),
                "svs_points": numeric(value_at(row, 6)),
                "source_sheet": "Charms Data",
                "source_row": row_idx,
            }
        )
    return out


def status_base_level_code(level_code: str) -> str | None:
    match = re.match(r"(.+?)\s+\(Status:\s*\d+\)$", level_code)
    if match:
        return match.group(1)
    match = re.match(r"(.+?)\s+Status:\s*\d+\)$", level_code)
    if match:
        return f"{match.group(1)})"
    return None


def extract_chief_gear_stat_levels(gear_levels: list[dict[str, Any]]) -> list[dict[str, Any]]:
    anchors = {
        level_code: {"stat_percent": stat_percent, "deployment_capacity": deployment_capacity}
        for level_code, stat_percent, deployment_capacity in CHIEF_GEAR_STAT_ANCHORS
    }
    anchor_order = [level_code for level_code, _, _ in CHIEF_GEAR_STAT_ANCHORS]
    anchor_index = {level_code: index for index, level_code in enumerate(anchor_order)}
    levels_by_code = {row["gear_level_code"]: row for row in gear_levels}
    out: list[dict[str, Any]] = []

    for row in sorted(gear_levels, key=lambda item: numeric(item.get("sequence"), 0)):
        level_code = row["gear_level_code"]
        stat_percent = None
        deployment_capacity = None
        source_note = "wiki_main_level"

        if level_code in anchors:
            stat_percent = anchors[level_code]["stat_percent"]
            deployment_capacity = anchors[level_code]["deployment_capacity"]
        else:
            base_code = status_base_level_code(level_code)
            if base_code in anchors and base_code in anchor_index:
                current_anchor_pos = anchor_index[base_code]
                next_code = next((code for code in anchor_order[current_anchor_pos + 1 :] if code in levels_by_code), None)
                if next_code:
                    base_sequence = numeric(levels_by_code[base_code].get("sequence"), 0)
                    next_sequence = numeric(levels_by_code[next_code].get("sequence"), base_sequence)
                    current_sequence = numeric(row.get("sequence"), base_sequence)
                    span = max(1, next_sequence - base_sequence)
                    ratio = max(0, min(1, (current_sequence - base_sequence) / span))
                    base_anchor = anchors[base_code]
                    next_anchor = anchors[next_code]
                    stat_percent = base_anchor["stat_percent"] + ((next_anchor["stat_percent"] - base_anchor["stat_percent"]) * ratio)
                    deployment_capacity = base_anchor["deployment_capacity"] + (
                        (next_anchor["deployment_capacity"] - base_anchor["deployment_capacity"]) * ratio
                    )
                    source_note = "interpolated_status_step"

        out.append(
            {
                "gear_level_code": level_code,
                "sequence": row["sequence"],
                "stat_percent": truncate_decimal(float(stat_percent or 0), 2),
                "deployment_capacity": round(float(deployment_capacity or 0)),
                "attributes": ["attack_percent", "defense_percent"],
                "source_id": "whiteout_wiki_chief_gear_stats",
                "source_note": source_note,
            }
        )

    return out


def extract_chief_charm_stat_levels(charm_levels: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows_out = [
        {
            "charm_level": 0,
            "stat_percent": 0.0,
            "attributes": ["lethality_percent", "health_percent"],
            "source_id": "whiteout_wiki_chief_gear_stats",
            "source_note": "baseline",
        }
    ]
    for row in sorted(charm_levels, key=lambda item: numeric(item.get("charm_level"), 0)):
        level = int(row["charm_level"])
        rows_out.append(
            {
                "charm_level": level,
                "stat_percent": CHIEF_CHARM_STAT_PERCENT.get(level, 0.0),
                "attributes": ["lethality_percent", "health_percent"],
                "source_id": "whiteout_wiki_chief_gear_stats",
                "source_note": "wiki_charm_table",
            }
        )
    return rows_out


def extract_heroes(seed: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    current_generation = None
    current_rarity = "mythic"
    for row_idx, row in enumerate(rows(seed, "Heroes")[5:67], start=6):
        label = text_or_none(value_at(row, 0))
        if label:
            if label.lower().startswith("gen") or label.lower().startswith("getn"):
                match = re.search(r"(\d+)", label)
                current_generation = int(match.group(1)) if match else None
                current_rarity = "mythic"
            elif label.lower() in {"epic", "rare"}:
                current_generation = None
                current_rarity = label.lower()

        troop_type = text_or_none(value_at(row, 1))
        name = text_or_none(value_at(row, 2))
        if not troop_type or not name:
            continue
        out.append(
            {
                "hero_id": slug(name),
                "name": name,
                "troop_type": troop_type,
                "rarity": current_rarity,
                "generation": current_generation,
                "default_role": text_or_none(value_at(row, 10)),
                "source_sheet": "Heroes",
                "source_row": row_idx,
            }
        )
    return out


def extract_pets(seed: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    sheet_rows = rows(seed, "Pet Data")
    name_row = sheet_rows[3]
    pet_starts = [(idx, text_or_none(value)) for idx, value in enumerate(name_row) if text_or_none(value)]
    pets = [{"pet_id": slug(name), "name": name, "source_sheet": "Pet Data", "source_column": start + 1} for start, name in pet_starts]
    levels: list[dict[str, Any]] = []

    for row_idx, row in enumerate(sheet_rows[5:26], start=6):
        level_code = text_or_none(value_at(row, 2))
        if not level_code:
            continue
        for start, name in pet_starts:
            levels.append(
                {
                    "pet_id": slug(name),
                    "level_code": level_code,
                    "food": numeric(value_at(row, start)),
                    "manuals": numeric(value_at(row, start + 2)),
                    "potions": numeric(value_at(row, start + 4)),
                    "serum": numeric(value_at(row, start + 6)),
                    "svs_points": numeric(value_at(row, start + 8)),
                    "source_sheet": "Pet Data",
                    "source_row": row_idx,
                }
            )
    return pets, levels


def extract_experts(seed: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    experts = []
    affinity_levels: list[dict[str, Any]] = []
    skill_levels: list[dict[str, Any]] = []

    for sheet_name in EXPERT_SHEETS:
        sheet_rows = rows(seed, sheet_name)
        totals = sheet_rows[1]
        skill_names = sheet_rows[2]
        skill_desc = sheet_rows[4]
        stat_labels = sheet_rows[5] if len(sheet_rows) > 5 else []
        expert_id = slug(sheet_name)
        primary_stat_label = text_or_none(value_at(stat_labels, 5))
        secondary_stat_label = text_or_none(value_at(stat_labels, 6))
        skills = []
        for start_col in [11, 16, 21, 26]:
            skill_name = text_or_none(value_at(skill_names, start_col))
            if not skill_name:
                continue
            effect_1_label = text_or_none(value_at(stat_labels, start_col + 2))
            effect_2_label = text_or_none(value_at(stat_labels, start_col + 3))
            skills.append(
                {
                    "skill_id": slug(f"{sheet_name} {skill_name}"),
                    "name": skill_name,
                    "description": text_or_none(value_at(skill_desc, start_col)),
                    "start_column": start_col + 1,
                    "effect_1_label": effect_1_label,
                    "effect_2_label": effect_2_label,
                }
            )

        experts.append(
            {
                "expert_id": expert_id,
                "name": sheet_name,
                "total_affinity": numeric(value_at(totals, 3)),
                "total_sigils": numeric(value_at(totals, 4)),
                "total_books": numeric(value_at(totals, 5)),
                "total_learning_xp": numeric(value_at(totals, 6)),
                "skills": skills,
                "source_sheet": sheet_name,
            }
        )

        for row_idx, row in enumerate(sheet_rows[7:], start=8):
            rel_level = value_at(row, 2)
            if rel_level is None:
                continue
            if isinstance(rel_level, (int, float)):
                affinity_levels.append(
                    {
                        "expert_id": expert_id,
                        "relationship_label": text_or_none(value_at(row, 1)),
                        "level_code": str(rel_level),
                        "relationship_level": rel_level,
                        "affinity": numeric(value_at(row, 3)),
                        "sigils": numeric(value_at(row, 4)),
                        "primary_stat_label": primary_stat_label,
                        "primary_stat": numeric(value_at(row, 5), None),
                        "secondary_stat_label": secondary_stat_label,
                        "secondary_stat": numeric(value_at(row, 6), None),
                        "power": numeric(value_at(row, 8)),
                        "source_sheet": sheet_name,
                        "source_row": row_idx,
                    }
                )
            shared_skill_level = value_at(row, 10)
            for skill in skills:
                start_col = skill["start_column"] - 1
                skill_fields = [value_at(row, start_col + offset) for offset in range(5)]
                if not isinstance(shared_skill_level, (int, float)) or all(value is None for value in skill_fields):
                    continue
                skill_levels.append(
                    {
                        "expert_id": expert_id,
                        "skill_id": skill["skill_id"],
                        "skill_level": shared_skill_level,
                        "books": numeric(skill_fields[0]),
                        "learning_xp": numeric(skill_fields[1]),
                        "effect_1_label": skill.get("effect_1_label"),
                        "effect_1": numeric(skill_fields[2], None),
                        "effect_2_label": skill.get("effect_2_label"),
                        "effect_2": numeric(skill_fields[3], None),
                        "power": numeric(skill_fields[4]),
                        "source_sheet": sheet_name,
                        "source_row": row_idx,
                    }
                )

    return experts, affinity_levels, skill_levels


def extract_fire_crystal_refinement(seed: dict[str, Any]) -> list[dict[str, Any]]:
    sheet_rows = rows(seed, "Fire Crystal Refinement")
    out = []
    for tier_number, start_col in enumerate([1, 5, 9, 13, 17], start=1):
        tier = {
            "tier": tier_number,
            "cost_fire_crystals": numeric(value_at(sheet_rows[5], start_col)),
            "distribution": [],
            "expected_return": None,
            "return_per_fire_crystal": None,
            "max_weekly_expected": None,
            "weekly_min_cost": None,
            "weekly_min_expected_return": None,
            "weekly_max_cost": None,
            "source_sheet": "Fire Crystal Refinement",
        }

        for row in sheet_rows[5:18]:
            returned = value_at(row, start_col + 1)
            probability = value_at(row, start_col + 2)
            if isinstance(returned, (int, float)) and isinstance(probability, (int, float)):
                tier["distribution"].append({"return": returned, "probability": probability})
            label = text_or_none(returned)
            if label == "Expected Return":
                tier["expected_return"] = numeric(probability)
            elif label == "Return per FC":
                tier["return_per_fire_crystal"] = numeric(probability)
            elif label == "Max Weekly Expected":
                tier["max_weekly_expected"] = numeric(probability)

        tier["weekly_min_cost"] = numeric(value_at(sheet_rows[21], start_col + 2))
        tier["weekly_min_expected_return"] = numeric(value_at(sheet_rows[23], start_col + 2))
        tier["weekly_max_cost"] = numeric(value_at(sheet_rows[27], start_col + 2)) if len(sheet_rows) > 27 else None
        out.append(tier)
    return out


def extract_svs(seed: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for row_idx, row in enumerate(rows(seed, "SVS Prep Week")[8:26], start=9):
        activity = text_or_none(value_at(row, 1))
        if not activity:
            continue
        out.append(
            {
                "activity_id": slug(activity),
                "activity": activity,
                "input_quantity": numeric(value_at(row, 5), None),
                "points_formula": text_or_none(value_at(row, 6)),
                "sample_points": numeric(value_at(row, 9), None),
                "monday": text_or_none(value_at(row, 11)),
                "tuesday": text_or_none(value_at(row, 12)),
                "wednesday": text_or_none(value_at(row, 13)),
                "thursday": text_or_none(value_at(row, 14)),
                "friday": text_or_none(value_at(row, 15)),
                "notes": text_or_none(value_at(row, 16)),
                "source_sheet": "SVS Prep Week",
                "source_row": row_idx,
            }
        )
    return out


def extract_t12_totals(seed: dict[str, Any]) -> list[dict[str, Any]]:
    row = rows(seed, "T12 Exalted Data")[3]
    starts = {"infantry": 2, "lancer": 14, "marksman": 26}
    totals = []
    for troop_type, start in starts.items():
        totals.append(
            {
                "troop_type": troop_type,
                "steel": numeric(value_at(row, start)),
                "refined_fire_crystals": numeric(value_at(row, start + 1)),
                "fire_crystal_shards": numeric(value_at(row, start + 2)),
                "meat": numeric(value_at(row, start + 3)),
                "wood": numeric(value_at(row, start + 4)),
                "coal": numeric(value_at(row, start + 5)),
                "iron": numeric(value_at(row, start + 6)),
                "research_minutes": numeric(value_at(row, start + 7)),
                "research_days": numeric(value_at(row, start + 9)),
                "source_sheet": "T12 Exalted Data",
                "source_row": 4,
            }
        )
    return totals


def extract_t12_research_levels(seed: dict[str, Any]) -> list[dict[str, Any]]:
    sheet_rows = rows(seed, "T12 Exalted Data")
    out: list[dict[str, Any]] = []
    section_starts = [6, 47, 130]
    troop_blocks = [
        ("infantry", 1),
        ("lancer", 13),
        ("marksman", 25),
    ]
    for title_row_number in section_starts:
        title_row = sheet_rows[title_row_number - 1]
        for troop_type, start_col in troop_blocks:
            node_name = text_or_none(value_at(title_row, start_col))
            if not node_name:
                continue
            for row_idx, row in enumerate(sheet_rows[title_row_number + 1 :], start=title_row_number + 2):
                level = numeric(value_at(row, start_col), None)
                if level is None:
                    break
                out.append(
                    {
                        "node_id": slug(node_name),
                        "node_name": node_name,
                        "troop_type": troop_type,
                        "level": level,
                        "steel": numeric(value_at(row, start_col + 1)),
                        "refined_fire_crystals": numeric(value_at(row, start_col + 2)),
                        "fire_crystal_shards": numeric(value_at(row, start_col + 3)),
                        "meat": numeric(value_at(row, start_col + 4)),
                        "wood": numeric(value_at(row, start_col + 5)),
                        "coal": numeric(value_at(row, start_col + 6)),
                        "iron": numeric(value_at(row, start_col + 7)),
                        "research_minutes": numeric(value_at(row, start_col + 8)),
                        "power": numeric(value_at(row, start_col + 9)),
                        "stat_percent": numeric(value_at(row, start_col + 10)) * 100,
                        "source_sheet": "T12 Exalted Data",
                        "source_row": row_idx,
                    }
                )
    return out


def extract_hero_gear_reforge(seed: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for row_idx, row in enumerate(rows(seed, "Hero Gear Data")[235:], start=236):
        level = numeric(value_at(row, 1), None)
        if level is None:
            continue
        out.append(
            {
                "level": level,
                "xp": numeric(value_at(row, 2)),
                "total_xp": numeric(value_at(row, 3)),
                "source_sheet": "Hero Gear Data",
                "source_row": row_idx,
            }
        )
    return out


def hero_gear_piece_starts(sheet_rows: list[list[Any]], set_header_row: int, piece_header_row: int, field_width: int) -> list[dict[str, Any]]:
    starts = []
    current_set: dict[str, Any] | None = None
    set_headers = sheet_rows[set_header_row]
    piece_headers = sheet_rows[piece_header_row]
    for col_idx in range(0, len(piece_headers)):
        set_label = text_or_none(value_at(set_headers, col_idx))
        if set_label:
            match = re.match(r"(Infantry|Lancer|Marksman)\s+Set\s+(\d+)", set_label, flags=re.IGNORECASE)
            current_set = {
                "troop_type": match.group(1).lower() if match else slug(set_label),
                "set_number": int(match.group(2)) if match else None,
                "set_label": set_label,
            }
        piece = text_or_none(value_at(piece_headers, col_idx))
        if not piece or piece in {"Hero Gear", "Mastery"}:
            continue
        if current_set and col_idx + field_width - 1 < len(piece_headers):
            starts.append(
                {
                    **current_set,
                    "slot": slug(piece),
                    "slot_label": piece,
                    "start_col": col_idx,
                }
            )
    return starts


def extract_hero_gear_enhancement_levels(seed: dict[str, Any]) -> list[dict[str, Any]]:
    sheet_rows = rows(seed, "Hero Gear Data")
    piece_starts = hero_gear_piece_starts(sheet_rows, 1, 2, 3)
    out: list[dict[str, Any]] = []
    for row_idx, row in enumerate(sheet_rows[4:205], start=5):
        level = numeric(value_at(row, 1), None)
        if level is None:
            continue
        out.append(
            {
                "scope": "base",
                "level": level,
                "hero_gear_xp": numeric(value_at(row, 2)),
                "mythic_gear": numeric(value_at(row, 3)),
                "mithril": numeric(value_at(row, 4)),
                "source_sheet": "Hero Gear Data",
                "source_row": row_idx,
            }
        )
        for start in piece_starts:
            raw_values = [value_at(row, start["start_col"] + offset) for offset in range(3)]
            if all(value is None for value in raw_values):
                continue
            out.append(
                {
                    "scope": "set_piece",
                    "troop_type": start["troop_type"],
                    "set_number": start["set_number"],
                    "set_label": start["set_label"],
                    "slot": start["slot"],
                    "slot_label": start["slot_label"],
                    "level": level,
                    "hero_gear_xp": numeric(raw_values[0]),
                    "mythic_gear": numeric(raw_values[1]),
                    "mithril": numeric(raw_values[2]),
                    "source_sheet": "Hero Gear Data",
                    "source_row": row_idx,
                }
            )
    return out


def extract_hero_gear_mastery_levels(seed: dict[str, Any]) -> list[dict[str, Any]]:
    sheet_rows = rows(seed, "Hero Gear Data")
    piece_starts = hero_gear_piece_starts(sheet_rows, 207, 208, 2)
    out: list[dict[str, Any]] = []
    for row_idx, row in enumerate(sheet_rows[210:231], start=211):
        level = numeric(value_at(row, 1), None)
        if level is None:
            continue
        out.append(
            {
                "scope": "base",
                "level": level,
                "essence_stones": numeric(value_at(row, 2)),
                "mythic_gear": numeric(value_at(row, 3)),
                "source_sheet": "Hero Gear Data",
                "source_row": row_idx,
            }
        )
        for start in piece_starts:
            raw_values = [value_at(row, start["start_col"] + offset) for offset in range(2)]
            if all(value is None for value in raw_values):
                continue
            out.append(
                {
                    "scope": "set_piece",
                    "troop_type": start["troop_type"],
                    "set_number": start["set_number"],
                    "set_label": start["set_label"],
                    "slot": start["slot"],
                    "slot_label": start["slot_label"],
                    "level": level,
                    "essence_stones": numeric(raw_values[0]),
                    "mythic_gear": numeric(raw_values[1]),
                    "source_sheet": "Hero Gear Data",
                    "source_row": row_idx,
                }
            )
    return out


def researched_systems() -> list[dict[str, Any]]:
    return [
        {
            "system_id": "flame_tech",
            "name": "Flame Tech",
            "status": "schema_ready_exact_costs_needed",
            "confidence": "high for existence and unlock gate; low for exact node costs",
            "effective_date": "2026-04-15",
            "source_ids": ["google_play_current", "apple_app_store_version_history"],
            "facts": [
                "Current release notes list Flame Tech as new content.",
                "Release notes say it unlocks after the state reaches the required number of days and Helios Troops are unlocked.",
                "Dashboard needs a flame_tech_nodes table with branch, node, level, costs, stats, prerequisites, and state-age gate.",
            ],
            "recommended_tables": ["flame_tech_nodes", "player_research_state"],
        },
        {
            "system_id": "collection_gallery",
            "name": "Collection Gallery / permanent skins",
            "status": "schema_ready_exact_catalog_needed",
            "confidence": "high for system; low for full skin point catalog",
            "effective_date": "2026-04-15",
            "source_ids": ["google_play_current", "apple_app_store_version_history"],
            "facts": [
                "Current release notes list Collection Gallery as new content.",
                "Permanent skins grant Collection Points.",
                "Collection Points increase Collection Level and unlock rewards.",
            ],
            "recommended_tables": ["skin_catalog", "collection_levels", "player_skin_state"],
        },
        {
            "system_id": "icefire_warhymn_league",
            "name": "Icefire Warhymn League",
            "status": "event_schema_ready_scoring_needed",
            "confidence": "high for phases; low for scoring/reward tables",
            "effective_date": "2026-04-15",
            "source_ids": ["google_play_current", "apple_app_store_version_history"],
            "facts": [
                "Current release notes list Icefire Warhymn League as a solo competition.",
                "Known phases are Sign-Up, Qualifier, Elimination, and Pinnacle.",
                "Troops are not lost during the event.",
            ],
            "recommended_tables": ["event_scoring_rules", "event_reward_tiers", "player_event_plans"],
        },
        {
            "system_id": "normal_research_center",
            "name": "Normal Research Center research",
            "status": "tree_schema_ready_exact_nodes_needed",
            "confidence": "medium",
            "effective_date": "2026-03-23",
            "source_ids": ["bluestacks_research_center_2026"],
            "facts": [
                "Research Center unlocks at Furnace level 9.",
                "The three main tabs are Growth, Economy, and Battle/Military.",
                "Research uses Wood, Meat, Coal, Iron, and later Steel, with times increasing into late game.",
            ],
            "recommended_tables": ["normal_research_nodes", "player_research_state"],
        },
        {
            "system_id": "war_academy_helios",
            "name": "War Academy / T11 Helios",
            "status": "partial_from_workbook_and_web",
            "confidence": "medium",
            "effective_date": "2026-07-04",
            "source_ids": ["bluestacks_war_academy_2026", "ajackof_war_academy"],
            "facts": [
                "War Academy is a late-game military research building.",
                "Guides place availability around 220 state days and around FC5 access.",
                "Branches are Infantry, Marksman, and Lancer.",
                "Guide estimates put one Helios troop type around 13.4k Fire Crystal Shards plus large regular resource and steel costs.",
            ],
            "recommended_tables": ["war_academy_nodes", "player_research_state"],
        },
        {
            "system_id": "current_experts",
            "name": "Latest Experts",
            "status": "covered_through_kathy_in_seed",
            "confidence": "high",
            "effective_date": "2026-04-15",
            "source_ids": ["google_play_current", "apple_app_store_version_history", "outofgames_experts"],
            "facts": [
                "Ronne is listed in App Store version 1.31.20 on Apr 15.",
                "Kathy appears in the current Google Play What is new notes and in the uploaded seed workbook.",
                "The workbook already contains Cyrille, Agnes, Holger, Romulus, Fabian, Baldur, Valeria, Ronne, and Kathy.",
            ],
            "recommended_tables": ["expert_affinity_levels", "expert_skill_levels", "player_expert_state"],
        },
    ]


def make_player_template(game_data: dict[str, Any]) -> dict[str, Any]:
    levels_by_building: dict[str, list[dict[str, Any]]] = {}
    for level in game_data["building_levels"]:
        levels_by_building.setdefault(level["building_id"], []).append(level)

    buildings = {}
    for item in game_data["buildings"]:
        building_levels = sorted(
            levels_by_building.get(item["building_id"], []),
            key=lambda row: numeric(row.get("numerical_level"), 0),
        )
        buildings[item["building_id"]] = {
            "current": building_levels[0]["level_code"] if building_levels else "1",
            "target": building_levels[-1]["level_code"] if building_levels else "FC10",
        }
    gear_levels = sorted(game_data["chief_gear_levels"], key=lambda item: item["sequence"])
    default_gear_current = gear_levels[0]["gear_level_code"] if gear_levels else "Locked"
    default_gear_target = gear_levels[-1]["gear_level_code"] if gear_levels else "Locked"
    max_charm = max((int(item["charm_level"]) for item in game_data["chief_charm_levels"]), default=11)
    pets = {}
    for pet in game_data["pets"]:
        levels = [item["level_code"] for item in game_data["pet_levels"] if item["pet_id"] == pet["pet_id"]]
        pets[pet["pet_id"]] = {
            "current": levels[0] if levels else "0",
            "target": levels[-1] if levels else "100.1",
        }

    return {
        "schema_version": 1,
        "last_saved": None,
        "profile": {
            "chief_name": "",
            "state_number": "",
            "state_age_days": 0,
            "furnace_level": "1",
            "construction_speed_pct": 0,
            "research_speed_pct": 0,
            "training_speed_pct": 0,
            "learning_speed_pct": 0,
        },
        "resources": {item["resource_id"]: 0 for item in game_data["resource_types"]},
        "buildings": buildings,
        "chief_gear": {
            slug(slot): {"slot": slot, "current": default_gear_current, "target": default_gear_target}
            for slot in CHIEF_GEAR_SLOTS
        },
        "charms": {
            slug(f"{parent} {position}"): {"slot": f"{parent} {position}", "current": 0, "target": max_charm}
            for parent in CHARM_PARENTS
            for position in CHARM_POSITIONS
        },
        "heroes": {
            hero["hero_id"]: {
                "owned": False,
                "current_stars": 0,
                "target_stars": 5,
                "current_widget_level": 0,
                "target_widget_level": 10,
            }
            for hero in game_data["heroes"]
        },
        "hero_gear": {},
        "pets": pets,
        "troops": {
            f"{troop_type.lower()}_t{tier}": {
                "troop_type": troop_type,
                "tier": tier,
                "current": 0,
                "target": 0,
            }
            for troop_type in TROOP_TYPES
            for tier in range(1, 13)
        },
        "experts": {
            expert["expert_id"]: {"relationship_current": "0", "relationship_target": "100", "notes": ""}
            for expert in game_data["experts"]
        },
        "research": {
            item["system_id"]: {"current_note": "", "target_note": "", "priority": "Backlog"}
            for item in game_data["researched_systems"]
        },
        "custom_notes": "",
    }


def main() -> None:
    if not SEED_PATH.exists():
        raise FileNotFoundError(f"Seed extraction not found: {SEED_PATH}")

    with SEED_PATH.open("r", encoding="utf-8") as handle:
        seed = json.load(handle)

    buildings, building_levels, building_prerequisites = extract_buildings(seed)
    pets, pet_levels = extract_pets(seed)
    experts, expert_affinity_levels, expert_skill_levels = extract_experts(seed)
    chief_gear_levels = extract_chief_gear(seed)
    chief_charm_levels = extract_charm_levels(seed)

    game_data = {
        "generated_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "metadata": seed["metadata"],
        "sources": [
            {
                "source_id": "workbook_seed",
                "label": seed["metadata"]["source_workbook"],
                "url": str(DOWNLOADS / seed["metadata"]["source_workbook"]),
                "retrieved_at": seed["metadata"]["extracted_at_utc"],
                "notes": "Primary workbook seed. Last updated 2026-05-01.",
            },
            *WEB_SOURCES,
        ],
        "resource_types": [
            {"resource_id": rid, "name": name, "category": category, "unit": unit}
            for rid, name, category, unit in RESOURCE_TYPES
        ],
        "buildings": buildings,
        "building_levels": building_levels,
        "building_prerequisites": building_prerequisites,
        "chief_gear_slots": [{"slot_id": slug(slot), "name": slot} for slot in CHIEF_GEAR_SLOTS],
        "chief_gear_levels": chief_gear_levels,
        "chief_gear_stat_levels": extract_chief_gear_stat_levels(chief_gear_levels),
        "chief_charm_slots": [
            {"slot_id": slug(f"{parent} {position}"), "name": f"{parent} {position}", "gear_slot": parent, "position": position}
            for parent in CHARM_PARENTS
            for position in CHARM_POSITIONS
        ],
        "chief_charm_levels": chief_charm_levels,
        "chief_charm_stat_levels": extract_chief_charm_stat_levels(chief_charm_levels),
        "heroes": extract_heroes(seed),
        "hero_gear_enhancement_levels": extract_hero_gear_enhancement_levels(seed),
        "hero_gear_mastery_levels": extract_hero_gear_mastery_levels(seed),
        "hero_gear_reforge": extract_hero_gear_reforge(seed),
        "pets": pets,
        "pet_levels": pet_levels,
        "experts": experts,
        "expert_affinity_levels": expert_affinity_levels,
        "expert_skill_levels": expert_skill_levels,
        "fire_crystal_refinement": extract_fire_crystal_refinement(seed),
        "svs_scoring_rules": extract_svs(seed),
        "t12_totals": extract_t12_totals(seed),
        "t12_research_levels": extract_t12_research_levels(seed),
        "researched_systems": researched_systems(),
        "module_map": seed["module_map"],
        "canonical_tables": seed["canonical_tables"],
        "gaps": seed["gaps"],
        "state_schema": seed["state_schema"],
        "coverage": {
            "exact_from_workbook": [
                "building_levels",
                "building_prerequisites",
                "chief_gear_levels",
                "chief_gear_stat_levels",
                "chief_charm_levels",
                "chief_charm_stat_levels",
                "hero_catalog",
                "hero_gear_enhancement_levels",
                "hero_gear_mastery_levels",
                "pet_levels",
                "expert_affinity_levels",
                "expert_skill_levels",
                "fire_crystal_refinement",
                "svs_scoring_rules",
                "t12_totals",
                "t12_research_levels",
            ],
            "schema_ready_needs_in_game_tables": [
                "flame_tech_nodes",
                "collection_gallery",
                "normal_research_nodes",
                "full_war_academy_nodes",
                "event_reward_tiers",
            ],
        },
    }

    DATA_DIR.mkdir(exist_ok=True)
    SOURCE_DIR.mkdir(exist_ok=True)
    with (DATA_DIR / "game-data.json").open("w", encoding="utf-8") as handle:
        json.dump(game_data, handle, indent=2, ensure_ascii=True)
        handle.write("\n")

    with (DATA_DIR / "player-state-template.json").open("w", encoding="utf-8") as handle:
        json.dump(make_player_template(game_data), handle, indent=2, ensure_ascii=True)
        handle.write("\n")

    with (DATA_DIR / "workbook-inventory.json").open("w", encoding="utf-8") as handle:
        json.dump(
            {
                "metadata": seed["metadata"],
                "inventory": seed["inventory"],
                "canonical_tables": seed["canonical_tables"],
                "gaps": seed["gaps"],
                "state_schema": seed["state_schema"],
            },
            handle,
            indent=2,
            ensure_ascii=True,
        )
        handle.write("\n")

    shutil.copy2(SEED_PATH, SOURCE_DIR / "whiteout_survival_seed_extract.json")
    print(f"Wrote {DATA_DIR / 'game-data.json'}")
    print(f"Wrote {DATA_DIR / 'player-state-template.json'}")
    print(f"Wrote {DATA_DIR / 'workbook-inventory.json'}")


if __name__ == "__main__":
    main()
