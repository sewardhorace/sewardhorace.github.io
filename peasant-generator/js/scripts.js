

var PEASANT_HTML_TEMPLATE = `
<div class="peasant row" id="peasant">

    <div class="col-md-12">
        <button class="delete-btn">delete</button>
        <div>Occupation:<span class="written occupation">Blah</span></div>
        <div>HP:<span class="written hp">4</span></div>
        <div>Lucky roll: <span class="written lucky">blah</span></div>
        <div>Languages: <span class="written languages">Common tongue</span></div>
    </div>

    <div class="abilities col-xs-12 col-md-6">
        <h2>Abilities</h2>
        <div class="ability">
            <div>Strength:</div>
            <div><span class="written str-score">10</span></div>
            <div><span class="written str-mod">(+0)</span></div>
        </div>
        <div class="ability">
            <div>Agility:</div>
            <div><span class="written agi-score">10</span></div>
            <div><span class="written agi-mod">(+0)</span></div>
        </div>
        <div class="ability">
            <div>Stamina:</div>
            <div><span class="written sta-score">10</span></div>
            <div><span class="written sta-mod">(+0)</span></div>
        </div>
        <div class="ability">
            <div>Personality:</div>
            <div><span class="written per-score">10</span></div>
            <div><span class="written per-mod">(+0)</span></div>
        </div>
        <div class="ability">
            <div>Intelligence:</div>
            <div><span class="written int-score">10</span></div>
            <div><span class="written int-mod">(+0)</span></div>
        </div>
        <div class="ability">
            <div>Luck:</div>
            <div><span class="written luc-score">10</span></div>
            <div><span class="written luc-mod">(+0)</span></div>
        </div>
    </div>

    <div class="other col-xs-12 col-md-6">
        <div class="equipment">
            <h2>Equipment</h2>
            <div><span class="written weapon">Weapon</span></div>
            <div><span class="written goods">Goods</span></div>
            <div><span class="written equip">Goods</span></div>
            <div><span class="written cp">14 cp</span></div>
        </div>
    </div>
    </div>
`;

function templateToElement(HTMLTemplate) {
    var div = document.createElement('div');
    div.innerHTML = HTMLTemplate.trim();
    return div.firstChild; 
};

function setContents(parent, tempClassname, val) {
    var elem = parent.getElementsByClassName(tempClassname)[0];
    var classes = elem.getAttribute("class");
    classes = classes.replace(tempClassname, "").trim();
    elem.setAttribute("class", classes);
    elem.innerText = val;
};

function roll(sides, dice=1, mod=0) {
    var sum = 0;
    for (var i = 0; i < dice; i++) {
        sum += 1 + Math.floor(Math.random() * sides);
    }
    return sum + mod;
};

function randomSelection(ary) {
    return ary[Math.floor(Math.random()*ary.length)];
};

var luckyRolls = [
    "Harsh winter: All attack rolls",
    "The bull: Melee attack rolls",
    "Fortunate date: Missile fire attack rolls",
    "Raised by wolves: Unarmed attack rolls",
    "Conceived on horseback: Mounted attack rolls",
    
    "Born on the battlefield: Damage rolls",
    "Path of the bear: Melee damage rolls",
    "Hawkeye: Missile fire damage rolls",
    "Pack hunter: Attack and damage rolls for 0-level starting weapon",
    "Born under the loom: Skill checks (including thief skills)",
    
    "Fox's cunning: Find/disable traps",
    "Four-leafed clover: Find secret doors",
    "Seventh son: Spell checks",
    "The raging storm: Spell damage",
    "Righteous heart: Turn unholy checks",

    "Survived the plague: Magical healing",
    "Lucky sign: Saving throws",
    "Guardian angel: Saving throws to escape traps",
    "Survived a spider bite: Saving throws against poison",
    "Struck by lightning: Reflex saving throws",

    "Lived through famine: Fortitude saving throws",
    "Resisted temptation: Willpower saving throws",
    "Charmed house: Armor Class",
    "Speed of the cobra: Initiative",
    "Bountiful harvest: Hit points (applies at each level)",
    
    "Warrior's arm: Critical hit tables (double usual)",
    "Unholy house: Corruption rolls",
    "The Broken Star: Fumbles (double usual)",
    "Birdsong: Number of languages",
    "Wild child: Speed (each +1/-1 = +5'/-5' speed)",
];

var equipment = [
    "Backpack (2 gp)",
    "Candle (1 cp)",
    "Chain, 10' (30 gp)",
    "Chalk, 1 piece (1 cp)",
    "Chest, empty (2 gp)",

    "Crowbar (2 gp)",
    "Flask, empty (3 cp)",
    "Flint & steel (15 cp)",
    "Grappling hook (1 gp)",
    "Hammer, small (5 sp)",
    
    "Holy symbol (25 gp)",
    "Holy water, 1 vial (25 gp)",
    "Iron spike (1 sp)",
    "Lantern (10 gp)",
    "Mirror, hand-sized",

    "Oil, 1 flask (2 sp)",
    "Pole, 10-foot (15 cp)",
    "Rations, 1 day (5 cp)",
    "Rope, 50' (25 cp)",
    "Sack, large (12 cp)",

    "Sack, small (8 cp)",
    "Thieves' tools (25 gp)",
    "Torch (1 cp)",
    "Waterskin (5 sp)",
];

var occupations = [
    [ 1, 1, "Alchemist",        "Staff",                "Oil, 1 flask"],
    [ 2, 2, "Animal trainer",   "Club",                 "Pony"],
    [ 3, 3, "Armorer",          "Hammer (as club)",     "Iron helmet"],
    [ 4, 4, "Astrologer",       "Dagger",               "Spyglass"],
    [ 5, 5, "Barber",           "Razor (as dagger)",    "Scissors"],
    [ 6, 6, "Beadle",           "Staff",                "Holy Symbol"],
    [ 7, 7, "Beekeeper",        "Staff",                "Jar of honey"],
    [ 8, 8, "Blacksmith",       "Hammer (as club)",     "Steel tongs"],
    [ 9, 9, "Butcher",          "Cleaver (as axe)",     "Side of beef"],
    [10,10, "Caravan guard",    "Short sword",          "Linen, 1 yard"],

    [11,11, "Cheesemaker",      "Cudgel (as staff)",    "Stinky cheese"],
    [12,12, "Cobbler",          "Awl (as dagger)",      "Shoehorn"],
    [13,13, "Confidence artist","Dagger",               "Quality cloak"],
    [14,14, "Cooper",           "Crowbar (as club)",    "Barrel"],
    [15,15, "Costermonger",     "Knife (as dagger)",    "Fruit"],
    [16,16, "Cutpurse",         "Dagger",               "Small chest"],
    [17,17, "Ditch digger",     "Shovel (as staff)",    "Fine dirt, 1 lb."],
    [18,18, "Dock worker",      "Pole (as staff)",      "1 late RPG book"],
    [19,19, "Dwarven apothecarist",     "Cudgel (as staff)",    "Steel vial"],
    [20,20, "Dwarven blacksmith",       "Hammer (as club)",     "Mithril, 1 oz."],
    
    [21,21, "Dwarven chest-maker",      "Chisel (as dagger)",   "Wood, 10 lbs."],
    [22,22, "Dwarven herder",           "Staff",                "Sow**"],
    [23,24, "Dwarven miner",            "Pick (as club)",       "Lantern"],
    [25,25, "Dwarven mushroom-farmer",  "Shovel (as staff)",    "Sack"],
    [26,26, "Dwarven rat-catcher",      "Club",                 "Net"],
    [27,28, "Dwarven stonemason",       "Hammer (as club)",     "Fine stone, 10 lbs."],
    [29,29, "Elven artisan",            "Staff",                "Clay, 1 lb."],
    [30,30, "Elven barrister",          "Quill (as dart)****",      "Book"],
    
    [31,31, "Elven chandler",   "Scissors (as dagger)", "Candles, 20"],
    [32,32, "Elven falconer",   "Dagger",               "Falcon"],
    [33,34, "Elven forester",   "Staff",                "Herbs, 1 lb."],
    [35,35, "Elven glassblower","Hammer (as club)",     "Glass beads"],
    [36,36, "Elven navigator",  "Shortbow****",             "Spyglass"],
    [37,38, "Elven sage",       "Dagger",               "Parchment and quill pen"],
    [39,47, "Farmer*",          "Pitchfork (as spear)", "Hen**"],
    
    [48,48, "Fortune-teller",   "Dagger",               "Tarot deck"],
    [49,49, "Gambler",          "Club",                 "Dice"],
    [50,50, "Gongfarmer",       "Trowel (as dagger)",   "Sack of night soil"],

    [51,52, "Grave digger",     "Shovel (as staff)",    "Trowel"],
    [53,54, "Guild beggar",     "Sling****",                "Crutches"],
    [55,55, "Halfling chicken butcher", "Hand axe",             "Chicken meat, 5 lbs."],
    [56,57, "Halfling dyer",            "Staff",                "Fabric, 3 yards"],
    [58,58, "Halfling glovemaker",      "Awl (as dagger)",      "Gloves, 4 pairs"],
    [59,59, "Halfling gypsy",           "Sling****",                "Hex doll"],
    [60,60, "Halfling haberdasher",     "Scissors (as dagger)", "Fine suits, 3 sets"],

    [61,61, "Halfling mariner",         "Knife (as dagger)",    "Sailcloth, 2 yards"],
    [62,62, "Halfling moneylender",     "Short sword",          "5 gp, 10 sp, 200 cp"],
    [63,63, "Halfling trader",          "Short sword",          "20 sp"],
    [64,64, "Halfling vagrant",         "Club",                 "Begging bowl"],
    [65,65, "Healer",                   "Club",                 "Holy water, 1 vial"],
    [66,66, "Herbalist",                "Club",                 "Herbs, 1 lb."],
    [67,67, "Herder",                   "Staff",                "Herding dog**"],
    [68,69, "Hunter",                   "Shortbow****",             "Deer pelt"],
    [70,70, "Indentured servant",       "Staff",                "Locket"],

    [71,71, "Jester",           "Dart****",                 "Silk clothes"],
    [72,72, "Jeweler",          "Dagger",               "Gem worth 20 gp"],
    [73,73, "Locksmith",        "Dagger",               "Fine tools"],
    [74,74, "Mendicant",        "Club",                 "Cheese dip"],
    [75,75, "Mercenary",        "Longsword",            "Hide armor"],
    [76,76, "Merchant",         "Dagger",               "4 gp, 14 sp, 27 cp"],
    [77,77, "Miller/baker",     "Club",                 "Flour, 1 lb."],
    [78,78, "Minstrel",         "Dagger",               "Ukulele"],
    [79,79, "Noble",            "Longsword",            "Gold ring worth 10 gp"],
    [80,80, "Orphan",           "Club",                 "Rag doll"],

    [81,81, "Ostler",           "Staff",                "Bridle"],
    [82,82, "Outlaw",           "Short sword",          "Leather armor"],
    [83,83, "Rope maker",       "Knife (as dagger)",    "Rope, 100'"],
    [84,84, "Scribe",           "Dart****",                 "Parchment, 10 sheets"],
    [85,85, "Shaman",           "Mace",                 "Herbs, 1 lb."],
    [86,86, "Slave",            "Club",                 "Strange-looking rock"],
    [87,87, "Smuggler",         "Sling****",                "Waterproof sack"],
    [88,88, "Soldier",          "Spear",                "Shield"],
    [89,90, "Squire",           "Longsword",            "Steel helmet"],

    [91,91, "Tax collector",    "Longsword",            "100 cp"],
    [92,93, "Trapper",          "Sling****",                "Badger pelt"],
    [94,94, "Urchin",           "Stick (as club)",      "Begging bowl"],
    [95,95, "Wainwright",       "Club",                 "Pushcart***"],
    [96,96, "Weaver",           "Dagger",               "Fine suit of clothes"],
    [97,97, "Wizard's apprentice",  "Dagger",           "Black grimoire"],
    [98,100,"Woodcutter",       "Handaxe",              "Bundle of wood"],
];

function postProcessOccupations(str) {
    if (str.includes("*")) {
        if (str.includes("****")){
            //missile fire weapon
            var ammo = roll(6);
            str = str.replace("****", " (" + ammo + " ammo)");
        } else if (str.includes("***")){
            //cart contents
            var contents = randomSelection(["tomatoes","nothing","straw","your dead","dirt","rocks"]);
            str = str.replace("***", " (containing " + contents + ")");
        } else if (str.includes("**")){
            //farm animals
            var animal = randomSelection(["sheep","goat","cow","duck","goose","mule"]);
            str = str.replace("**", " (if not first of this occupation, " + animal + " instead)");
        } else {
            //farmer type
            var type = randomSelection(["potato","wheat","turnip","corn","rice","parsnip","radish","rutabaga"]);
            str = str.replace("*", " (" + type + ")");
        }
    }
    return str;
};

function Table(rows, size, process) {

    this.addRow = function(row) {
        var start = row.shift();
        var end = row.shift();
        for (var i = start; i <= end; i++){
            var newRow = [];
            for (var j = 0; j < row.length; j++) {
                newRow.push(row[j]);
            }
            this.rows[i] = newRow;
        }
    };

    this.init = function(rows, size, process) {
        this.size = size;
        this.rows = [];
        for (var i = 0; i <= size; i++)
            this.rows.push([]);
        for (var i = 0; i < rows.length; i++)
            this.addRow(rows[i]);
        this.process = process;
    };

    this.get = function() {
        var row = this.rows[roll(this.size)];
        var processedRow = [];
        for (var i = 0; i < row.length; i++){
            processedRow.push(this.process(row[i]));
        }
        return processedRow;
    };
    
    this.init(rows, size, process);
};

var occupationsTable = new Table(occupations, 100, postProcessOccupations);

function modFromScore(score) {
    if (score <= 3) return {val:-3, str:"(-3)"};
    if (score <= 5) return {val:-2, str:"(-2)"};
    if (score <= 8) return {val:-1, str:"(-1)"};
    if (score <= 12) return {val:0, str:"(+0)"};
    if (score <= 15) return {val:1, str:"(+1)"};
    if (score <= 17) return {val:2, str:"(+2)"};
    if (score <= 18) return {val:3, str:"(+3)"};
};

function Peasant() {

    this.init = function() {
        //abilities
        this.strength = { score: roll(6, 3) };
        this.agility = { score: roll(6, 3) };
        this.stamina = { score: roll(6, 3) };
        this.personality = { score: roll(6, 3) };
        this.intelligence = { score: roll(6, 3) };
        this.luck = { score: roll(6, 3) };
    
        //modifiers
        this.strength.mod = modFromScore(this.strength.score);
        this.agility.mod = modFromScore(this.agility.score);
        this.stamina.mod = modFromScore(this.stamina.score);
        this.personality.mod = modFromScore(this.personality.score);
        this.intelligence.mod = modFromScore(this.intelligence.score);
        this.luck.mod = modFromScore(this.luck.score);

        //lucky roll
        this.luckyRoll = luckyRolls[roll(30)-1];

        //saving throws
        this.fortitude = 0;
        this.reflex = 0;
        this.willpower = 0;

        //languages
        this.languages = "Common tongue";
        if (this.intelligence.mod.val > 0) this.languages += " + " + this.intelligence.mod.val + " additional";

        //hit points
        this.maxHP = roll(4) + this.stamina.mod.val;
        if (this.maxHP < 1) this.maxHP = 1;

        //copper pieces
        this.copper = roll(12, 5);

        //xp
        this.xp = 0;

        //equipment
        this.equipment = equipment[roll(24)-1];

        //occupation
        var cols = occupationsTable.get();
        this.occupation = cols[0];
        this.weapon = cols[1];
        this.goods = cols[2];

        this.attackMod = 0;
    };

    this.init();
};


function deletePeasant(e) {
    var id = e.target.getAttribute("data-target");
    document.getElementById("peasant-" + id).remove();
};

var target = document.getElementsByClassName("content")[0];
var id = 0;
function addPeasant() {
    id++;
    console.log(id);
    var elem = templateToElement(PEASANT_HTML_TEMPLATE);
    var p = new Peasant();

    setContents(elem, "occupation", p.occupation);
    setContents(elem, "hp", p.maxHP);
    setContents(elem, "lucky", p.luckyRoll);
    setContents(elem, "languages", p.languages);
   
    setContents(elem, "str-score", p.strength.score);
    setContents(elem, "str-mod", p.strength.mod.str);
    setContents(elem, "agi-score", p.agility.score);
    setContents(elem, "agi-mod", p.agility.mod.str);
    setContents(elem, "sta-score", p.stamina.score);
    setContents(elem, "sta-mod", p.stamina.mod.str);
    setContents(elem, "per-score", p.personality.score);
    setContents(elem, "per-mod", p.personality.mod.str);
    setContents(elem, "int-score", p.intelligence.score);
    setContents(elem, "int-mod", p.intelligence.mod.str);
    setContents(elem, "luc-score", p.luck.score);
    setContents(elem, "luc-mod", p.luck.mod.str);

    setContents(elem, "weapon", p.weapon);
    setContents(elem, "goods", p.goods);
    setContents(elem, "equip", p.equipment);
    setContents(elem, "cp", p.copper + " cp");

    var deleteBtn = elem.getElementsByClassName("delete-btn")[0];
    deleteBtn.addEventListener('click', deletePeasant, false);
    deleteBtn.setAttribute("data-target", id);

    elem.setAttribute("id", "peasant-" + id);
    target.insertBefore(elem, target.childNodes[2]);
};

document.getElementById("generate-btn").addEventListener('click', addPeasant, false);