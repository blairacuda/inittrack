# Open5e API Reference

Base: `https://api.open5e.com` | Beta: `https://api-beta.open5e.com`
GET-only, no auth required, CORS enabled, JSON responses.

## Conventions

**Pagination:** All list endpoints return `{count, next, previous, results:[...]}`. Params: `?page=N&page_size=N`
**Field selection:** `?fields=name,slug,level` — returns only specified fields
**Ordering:** `?ordering=name` (prefix `-` for descending)
**Filter lookups:** Append to field name with `__`: `exact` (default), `iexact`, `icontains`, `contains`, `in` (comma-separated), `gt`, `gte`, `lt`, `lte`, `range` (min,max), `isnull` (true/false). Combine with `&` (AND logic).
**Document fields:** All resources include `document__slug`, `document__title`, `document__url`, `document__license_url`. Filter by source: `?document__slug=wotc-srd`

---

## V1 API (Production)

Base path: `/v1/` (also accessible at `/`)
Identifier field: `slug` (format: `lowercase-with-hyphens`, e.g. `fireball`, `adult-black-dragon`)

### /v1/spells
Spells with casting info, components, class associations.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `spell_level` int 0-9 [exact,range,gt,gte,lt,lte] (0=cantrip) | `level_int` int (alias for spell_level) | `school` str [exact,iexact,in] values: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, Transmutation | `duration` str [exact,iexact,in] | `concentration` str | `requires_concentration` bool | `requires_verbal_components` bool | `requires_somatic_components` bool | `requires_material_components` bool | `casting_time` str [exact,iexact,in] | `dnd_class` str [exact,iexact,in,icontains] | `spell_lists` str | `spell_lists_not` str | `target_range_sort` int [exact,range,gt,gte,lt,lte] | `document__slug` str [exact,iexact,in] | `document__slug__not_in` str

**Response fields:** slug, name, desc (markdown), higher_level, page, range (str e.g. "150 feet"), target_range_sort (int), components (str e.g. "V, S, M"), requires_verbal_components (bool), requires_somatic_components (bool), requires_material_components (bool), material (?str), can_be_cast_as_ritual (bool), ritual (str), duration, concentration (str), requires_concentration (bool), casting_time, level (str e.g. "3rd-level"), level_int (int 0-9), spell_level (int 0-9), school, dnd_class (str), spell_lists (str[]), archetype, circles, document__*

**Example queries:**
`/v1/spells?school=Evocation&spell_level__gte=3` — Evocation spells level 3+
`/v1/spells?spell_level=0&dnd_class__icontains=Wizard` — Wizard cantrips
`/v1/spells?requires_concentration=true` — Concentration spells
`/v1/spells?requires_material_components=false` — No material components

### /v1/monsters
Creatures/NPCs with complete stat blocks, actions, abilities.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `cr` number [exact,range,gt,gte,lt,lte] (decimal: 0.125, 0.25, 0.5, 1, 2...) | `hit_points` int [exact,range,gt,gte,lt,lte] | `armor_class` int [exact,range,gt,gte,lt,lte] | `type` str [exact,iexact,in,icontains] values: Aberration, Beast, Celestial, Construct, Dragon, Elemental, Fey, Fiend, Giant, Humanoid, Monstrosity, Ooze, Plant, Undead | `size` str [exact,iexact,in,icontains] values: Tiny, Small, Medium, Large, Huge, Gargantuan | `environments` str | `environments_json` str [exact,iexact,in,icontains] | `page_no` int [exact,range,gt,gte,lt,lte] | `document__slug` str [exact,iexact,in] | `document__slug__not_in` str

**Response fields:** slug, name, desc, size, type, subtype (?str), group (?str), alignment, armor_class (int), armor_desc, hit_points (int), hit_dice (str e.g. "17d12+85"), speed (obj e.g. {walk:"40 ft.",fly:"80 ft."}), strength/dexterity/constitution/intelligence/wisdom/charisma (int), *_save (?int) for each ability, perception (?int), skills (obj e.g. {perception:9,stealth:5}), damage_vulnerabilities/damage_resistances/damage_immunities/condition_immunities (str), senses, languages, challenge_rating (str), cr (number), actions/bonus_actions/reactions/legendary_actions/special_abilities (array of {name,desc}), legendary_desc, spell_list (str[]), page_no (?int), environments (str[]), img_main (?str), document__*, v2_converted_path

**Example queries:**
`/v1/monsters?type=Dragon&cr__gte=10` — Dragons CR 10+
`/v1/monsters?type=Undead&size=Medium` — Medium undead
`/v1/monsters?environments=Forest` — Forest creatures
`/v1/monsters?hit_points__gte=200` — High HP creatures

**Example response object (inside results array):**
```json
{"slug":"goblin","name":"Goblin","size":"Small","type":"Humanoid","subtype":"goblinoid","group":"Goblinoids","alignment":"neutral evil","armor_class":15,"armor_desc":"leather armor, shield","hit_points":7,"hit_dice":"2d6","speed":{"walk":"30 ft."},"strength":8,"dexterity":14,"constitution":10,"intelligence":10,"wisdom":8,"charisma":8,"strength_save":null,"dexterity_save":null,"constitution_save":null,"intelligence_save":null,"wisdom_save":null,"charisma_save":null,"perception":null,"skills":{"stealth":6},"damage_vulnerabilities":"","damage_resistances":"","damage_immunities":"","condition_immunities":"","senses":"darkvision 60 ft., passive Perception 9","languages":"Common, Goblin","challenge_rating":"1/4","cr":0.25,"actions":[{"name":"Scimitar","desc":"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."},{"name":"Shortbow","desc":"Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."}],"bonus_actions":[],"reactions":[],"legendary_desc":"","legendary_actions":[],"special_abilities":[{"name":"Nimble Escape","desc":"The goblin can take the Disengage or Hide action as a bonus action on each of its turns."}],"spell_list":[],"page_no":166,"environments":["Forest","Grassland","Hill"],"img_main":null,"document__slug":"wotc-srd","document__title":"Systems Reference Document"}
```

### /v1/classes
Character classes with hit dice, proficiencies, archetypes.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `hit_dice` str [exact,iexact,in] | `hp_at_1st_level` str [exact,iexact,icontains] | `hp_at_higher_levels` str [exact,iexact,icontains] | `prof_armor` str [exact,iexact,icontains] | `prof_weapons` str [exact,iexact,icontains] | `prof_tools` str [exact,iexact,icontains] | `prof_skills` str [exact,iexact,icontains] | `equipment` str [exact,iexact,icontains] | `spellcasting_ability` str [exact,iexact,icontains] | `subtypes_name` str [exact,iexact,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** name, slug, desc, hit_dice (str e.g. "1d8"), hp_at_1st_level, hp_at_higher_levels, prof_armor, prof_weapons, prof_tools, prof_saving_throws, prof_skills, equipment, table (markdown), spellcasting_ability, subtypes_name (str e.g. "Arcane Traditions"), archetypes (obj[]), document__*

### /v1/races
Playable races with ability score improvements and traits.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `asi_desc` str [exact,iexact,icontains] | `age` str [exact,iexact,icontains] | `alignment` str [exact,iexact,icontains] | `size` str [exact,iexact,icontains] | `speed_desc` str [exact,iexact,icontains] | `languages` str [exact,iexact,icontains] | `vision` str [exact,iexact,icontains] | `traits` str [exact,iexact,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** name, slug, desc, asi_desc, asi (array), age, alignment, size, size_raw, speed (obj), speed_desc, languages, vision, traits, subraces (obj[]), document__*

### /v1/backgrounds
Character backgrounds with features and proficiencies.

**Filters:** `slug` str [exact,iexact,in,icontains] | `name` str [exact,iexact,icontains] | `skill_proficiencies` str [exact,iexact,icontains] | `tool_proficiencies` str [exact,iexact,icontains] | `languages` str [exact,iexact,icontains] | `feature` str [exact,iexact,icontains] | `feature_desc` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** name, slug, desc, skill_proficiencies, tool_proficiencies, languages, equipment, feature, feature_desc, suggested_characteristics, document__*

### /v1/feats
Character feats and special abilities.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** slug, name, desc, prerequisite, effects_desc (str[]), document__*

### /v1/magicitems
Magical items with rarity and attunement.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `type` str [exact,iexact,icontains] | `rarity` str [exact,iexact,icontains] values: Common, Uncommon, Rare, Very Rare, Legendary, Artifact | `requires_attunement` str [exact,iexact] | `document__slug` str [exact,iexact,in]

**Response fields:** slug, name, type, desc, rarity, requires_attunement, document__*

### /v1/weapons
Weapons with damage, properties, weight, cost.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `cost` str [exact,iexact,icontains] | `damage_dice` str [exact,iexact,icontains] | `damage_type` str [exact,iexact,icontains] | `weight` str [exact,iexact,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** name, slug, category, cost, damage_dice, damage_type, weight, properties (str[]), document__*

### /v1/armor
Armor with AC bonuses and properties.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `cost` str [exact,iexact,icontains] | `weight` str [exact,iexact,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** name, slug, category, base_ac (int), plus_dex_mod (bool), plus_con_mod (bool), plus_wis_mod (bool), plus_flat_mod (int), plus_max (int, max dex bonus), ac_string, strength_requirement (?int), cost, weight, stealth_disadvantage (bool), document__*

### /v1/conditions
Game conditions (poisoned, paralyzed, etc.).

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** slug, name, desc, document__*

### /v1/spelllist
Organized lists of spells (class-specific, thematic).

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** slug, name, desc, spells (str[] of spell slugs), document__*

### /v1/documents
Source documents and licensing info.

**Filters:** `slug` str [exact] | `title` str [exact] | `organization` str [exact] | `license` str [exact]

**Response fields:** title, slug, url, license, desc, author, organization, version, copyright, license_url, v2_related_key
Common slugs: `wotc-srd`, `o5e`, `tob`, `cc`, `tob2`, `tob3`, `a5e`

### /v1/sections
Game rules sections from source documents.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `parent` str [exact,iexact,in,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** slug, name, desc, parent (str, parent section slug), document__*

### /v1/planes
Planar locations and properties.

**Filters:** `slug` str [exact,iexact,in] | `name` str [exact,iexact,icontains] | `desc` str [exact,iexact,in,icontains] | `document__slug` str [exact,iexact,in]

**Response fields:** slug, name, desc, parent (str, parent plane slug), document__*

---

## V2 API (Beta)

Base path: `/v2/`
Identifier field: `key` (format: `docprefix_name`, e.g. `srd_fireball`, `srd_adult-black-dragon`)
Key differences from V1: normalized FK/M2M relationships instead of embedded strings, document-based hierarchy, boolean fields instead of string representations.
Common filters on all V2 endpoints: `key` [exact,iexact,in], `name` [exact,iexact,icontains], `document__key` [exact,iexact,in], `document__gamesystem__key` [exact,iexact,in]

### /v2/creatures
Creatures with full stat blocks (replaces V1 /v1/monsters).

**Additional filters:** `size` str [exact] (FK to Size, e.g. "huge") | `category` str [exact,iexact] (monster/npc) | `subcategory` str [exact,iexact] | `type` str [exact] (FK to CreatureType, e.g. "srd_dragon") | `challenge_rating_decimal` number 0-30 [exact,lt,lte,gt,gte] | `armor_class` int [exact,lt,lte,gt,gte] | `ability_score_strength` int [exact,lt,lte,gt,gte] | `ability_score_dexterity` (same) | `ability_score_constitution` (same) | `ability_score_intelligence` (same) | `ability_score_wisdom` (same) | `ability_score_charisma` (same) | `saving_throw_strength` int [isnull] | `saving_throw_dexterity` (same) | ...all 6 saves [isnull] | `skill_bonus_acrobatics` int [isnull] | `skill_bonus_animal_handling` (same) | ...all 18 skills [isnull] | `passive_perception` int [exact,lt,lte,gt,gte]

**Response fields:** key, name, description, type (obj {key,name}), size (str), category, subcategory (?str), alignment, armor_class (int), armor_class_descriptor, hit_points (int), hit_dice, challenge_rating_decimal (number), challenge_rating_text, proficiency_bonus (int), experience_points_integer (int), initiative_bonus (int), ability_score_[strength|dexterity|constitution|intelligence|wisdom|charisma] (int), saving_throw_[str|dex|con|int|wis|cha] (?int), skill_bonus_* (?int, 18 individual fields), passive_perception (int), senses (obj[]), languages (obj[]), damage_vulnerabilities/resistances/immunities (obj[]), condition_immunities (obj[]), actions/traits/reactions/legendary_actions (obj[]), creaturesets (str[]), environments (obj[]), document (obj), images (obj[])

**Example queries:**
`/v2/creatures?type=srd_dragon&challenge_rating_decimal__gte=10` — Dragons CR 10+
`/v2/creatures?skill_bonus_perception__isnull=false&passive_perception__gte=15` — High perception
`/v2/creatures?size=huge&document__key=srd` — Huge SRD creatures

### /v2/spells
Spells with detailed casting info (replaces V1 /v1/spells).

**Additional filters:** `classes__key` str [exact,iexact,in] (e.g. "srd_wizard") | `classes__name` str [in] | `level` int 0-9 [exact,range,gt,gte,lt,lte] | `range` int [exact,range,gt,gte,lt,lte] | `school__key` str [exact] (e.g. "srd_evocation") | `school__name` str [exact,iexact,in] | `duration` str [exact,iexact,in] | `concentration` bool | `verbal` bool | `somatic` bool | `material` bool | `material_consumed` bool | `casting_time` str [exact,iexact,in]

**Response fields:** key, name, description, level (int 0-9), school (obj {key,name}), target_type, range_text, range (?int), range_unit (?str), ritual (bool), casting_time, reaction_condition (?str), verbal (bool), somatic (bool), material (bool), material_specified (?str), material_cost (?int), material_consumed (bool), target_count (?int), duration, concentration (bool), higher_level, classes (obj[]), document (obj), images (obj[])

**Example queries:**
`/v2/spells?classes__key=srd_wizard&level__gte=3` — Wizard spells level 3+
`/v2/spells?concentration=true` — Concentration spells
`/v2/spells?school__key=srd_evocation&level=0` — Evocation cantrips
`/v2/spells?material=false` — No material component spells

### V2 Additional Endpoints

All share common filters (key, name, document__key, document__gamesystem__key) and support pagination/field selection/ordering.

**Character Creation:**
`/v2/classes` — CharacterClass: key, name, hit_dice, spellcasting_ability, subclasses. Filters: hit_dice
`/v2/species` — Species (races): key, name, size, speed, traits. Filters: size
`/v2/backgrounds` — Background: key, name, description, feature
`/v2/feats` — Feat: key, name, description, prerequisite

**Equipment:**
`/v2/items` — Item (all types): key, name, description, rarity, requires_attunement, weapon, armor, category. Filters: category__key, rarity__key, requires_attunement
`/v2/magicitems` — Filtered view of items (is_magic_item=true), same schema
`/v2/weapons` — Weapon: key, name, damage_dice, damage_type, properties. Filters: damage_type__key
`/v2/armor` — Armor: key, name, base_ac, category, stealth_disadvantage. Filters: category

**Creature Related:**
`/v2/creaturetypes` — CreatureType: key, name, descriptions. Values: dragon, undead, humanoid, aberration, etc.
`/v2/creaturesets` — CreatureSet: key, name, creatures (groupings like "Goblinoids")

**Spell Related:**
`/v2/spellschools` — SpellSchool: key, name. Values: abjuration, conjuration, divination, enchantment, evocation, illusion, necromancy, transmutation

**Reference Data:**
`/v2/documents` — Document: key, name, publisher, gamesystem, license. Filters: publisher__key, gamesystem__key
`/v2/licenses` — License: key, name, url
`/v2/publishers` — Publisher: key, name
`/v2/gamesystems` — GameSystem: key, name. Values: dnd5e, a5e

**Taxonomy Lookups:**
`/v2/abilities` — Ability: key, name. Values: strength, dexterity, constitution, intelligence, wisdom, charisma
`/v2/skills` — Skill: key, name, ability (FK). Filters: ability__key
`/v2/sizes` — Size: key, name. Values: tiny, small, medium, large, huge, gargantuan
`/v2/alignments` — Alignment: key, name
`/v2/conditions` — Condition: key, name, description
`/v2/damagetypes` — DamageType: key, name. Values: fire, cold, lightning, acid, poison, piercing, slashing, bludgeoning, etc.
`/v2/languages` — Language: key, name, script
`/v2/environments` — Environment: key, name. Values: forest, desert, mountain, urban, underwater, etc.

**Items Related:**
`/v2/itemsets` — ItemSet: key, name, items
`/v2/itemcategories` — ItemCategory: key, name. Values: Weapon, Armor, Potion, Scroll, etc.
`/v2/itemrarities` — ItemRarity: key, name. Values: common, uncommon, rare, very-rare, legendary, artifact
`/v2/weaponproperties` — WeaponProperty: key, name, description. Values: finesse, versatile, reach, thrown, etc.

**Rules:**
`/v2/rules` — Rule: key, name, description, parent. Filters: parent__key
`/v2/rulesets` — RuleSet: key, name, rules

**Other:**
`/v2/images` — Image: key, url, alt_text
`/v2/services` — Service: key, name, cost (in-game services like inn stay, spell casting)
`/v2/enums` — Special endpoint: returns all enum values used across the V2 API
