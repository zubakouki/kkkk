"use strict";
var __importDefault = this && this.__importDefault || function(t) {
	return t && t.__esModule ? t : {
		default: t
	}
};
Object.defineProperty(exports, "__esModule", {
	value: !0
});
exports.WorldSpawner = void 0;
const Animal_1 = require("../entity/Animal"),
	EntityType_1 = require("../enums/EntityType"),
	EntityUtils_1 = require("../utils/EntityUtils"),
	Entity_1 = require("../entity/Entity"),
	Utils_1 = require("../utils/Utils"),
	serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class WorldSpawner {
	//FOREST MOBS
	crab_bosses = 0;
	crabs = 0;
	spiders = 0;
	wolfs = 0;
	rabbits = 0;
	boars = 0;
	hawks = 0;
	//SEA MOBS
	fishs = 0;
	treasure = 0;
	krakens = 0;
	//WINTER MOBS
    dragons = 0;
	baby_dragons = 0;
	foxs = 0;
	bears = 0;
	penguins = 0;
	baby_mammoths = 0;
	mammoths = 0;
	//DESERT MOBS
	vultures = 0;
	sand_worms = 0;
	//LAVA MOBS
	lava_dragons = 0;
	baby_lavas = 0;
	flames = 0;
	lastTreasureSpawned = -1;
	gameServer;
	constructor(t) {
		this.gameServer = t
	}
	// SEA SPAWN
	addAnimal(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 9720 + Math.floor(Math.random() * (13497 - 9720 + 1));
		const n = 130 + Math.floor(Math.random() * (31381 - 130 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	  // FOREST SPAWN
	  addAnimalw(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 1578 + Math.floor(Math.random() * (5143 - 1578 + 1));
		const n = 1671 + Math.floor(Math.random() * (4425 - 1671 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	  // BEACH SPAWN
	  addAnimaBEACH(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 9285 + Math.floor(Math.random() * (9819 - 9285 + 1));
		const n = 15435 + Math.floor(Math.random() * (30051 - 15435 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	  // WINTER SPAWN
	  addAnimalWinter(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 4861 + Math.floor(Math.random() * (5830 - 4861 + 1));
		const n = 6694 + Math.floor(Math.random() * (8100 - 6694 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	  // CAVE SPAWN
	  addAnimalCave(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 7266 + Math.floor(Math.random() * (8811 - 7266 + 1));
		const n = 7796 + Math.floor(Math.random() * (9298 - 7796 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	  // DESERT SPAWN
	  addAnimalDesert(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 756 + Math.floor(Math.random() * (3630 - 756 + 1));
		const n = 7619 + Math.floor(Math.random() * (9222 - 7619 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	  // LAVA SPAWN
	  addAnimalLava(t) {
		const e = this.gameServer.entityPool.nextId();
		const i = new Animal_1.Animal(e, this.gameServer);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
	  
		// Téléportez l'animal de manière aléatoire entre les coordonnées spécifiées
		const s = 5787 + Math.floor(Math.random() * (7719 - 5787 + 1));
		const n = 2771 + Math.floor(Math.random() * (3728 - 2771 + 1));
	  
		i.onSpawn(s, n, 0, t);
		i.initOwner(i);
		i.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
		this.gameServer.initLivingEntity(i);
	  }
	addTreasure() {
		const t = this.gameServer.entityPool.nextId(),
			e = new Entity_1.Entity(t, 0, this.gameServer),
			i = serverconfig_json_1.default.world.islands[~~(Math.random() * serverconfig_json_1.default.world.islands.length)],
			r = Utils_1.Utils.randomMaxMin(i[0][0], i[1][0]),
			s = Utils_1.Utils.randomMaxMin(i[0][1], i[1][1]);
		e.x = r;
		e.y = s;
		e.type = EntityType_1.EntityType.TREASURE_CHEST;
		e.isSolid = !1;
		e.radius = this.gameServer.gameConfiguration.entities.treasure_chest.radius;
		e.health = this.gameServer.gameConfiguration.entities.treasure_chest.health;
		this.gameServer.initLivingEntity(e);
		this.lastTreasureSpawned = performance.now()
	}
	spawnEntities() {
		
		// CAVE MOBS
		if (this.dragons < this.gameServer.gameConfiguration.other.max_dragons) {
        	this.addAnimalCave(EntityType_1.EntityType.DRAGON);
        	this.dragons++
        }
		if (this.baby_dragons < this.gameServer.gameConfiguration.other.max_baby_dragons) {
        	this.addAnimalCave(EntityType_1.EntityType.BABY_DRAGON);
        	this.baby_dragons++
		}
		//WINTER MOBS
		if (this.foxs < this.gameServer.gameConfiguration.other.max_foxs) {
        	this.addAnimalWinter(EntityType_1.EntityType.FOX);
        	this.foxs++
        }
		if (this.bears < this.gameServer.gameConfiguration.other.max_bears) {
        	this.addAnimalWinter(EntityType_1.EntityType.BEAR);
        	this.bears++
        }
		if (this.baby_mammoths < this.gameServer.gameConfiguration.other.max_baby_mammoths) {
        	this.addAnimalWinter(EntityType_1.EntityType.BABY_MAMMOTH);
        	this.baby_mammoths++
        }
		if (this.mammoths < this.gameServer.gameConfiguration.other.max_mammoths) {
        	this.addAnimalWinter(EntityType_1.EntityType.MAMMOTH);
        	this.mammoths++
        }
		if (this.penguins < this.gameServer.gameConfiguration.other.max_penguins) {
        	this.addAnimalWinter(EntityType_1.EntityType.PENGUIN);
        	this.penguins++
        }
		// BEACH MOBS
		if (this.crab_bosses < this.gameServer.gameConfiguration.other.max_crab_bosses) {
			this.addAnimalw(EntityType_1.EntityType.CRAB_BOSS);
			this.crab_bosses++
		}
		if (this.crabs < this.gameServer.gameConfiguration.other.max_crabs) {
			this.addAnimaBEACH(EntityType_1.EntityType.CRAB);
			this.crabs++
		}
		// FOREST MOBS
		if (this.hawks < this.gameServer.gameConfiguration.other.max_hawks) {
			this.addAnimalw(EntityType_1.EntityType.HAWK);
			this.hawks++
		}
		if (this.boars < this.gameServer.gameConfiguration.other.max_boars) {
			this.addAnimalw(EntityType_1.EntityType.BOAR);
			this.boars++
		}
		if (this.wolfs < this.gameServer.gameConfiguration.other.max_wolfs) {
			this.addAnimalw(EntityType_1.EntityType.WOLF);
			this.wolfs++
		}
		if (this.spiders < this.gameServer.gameConfiguration.other.max_spiders) {
			this.addAnimalw(EntityType_1.EntityType.SPIDER);
			this.spiders++
		}
		if (this.rabbits < this.gameServer.gameConfiguration.other.max_rabbits) {
			this.addAnimalw(EntityType_1.EntityType.RABBIT);
			this.rabbits++
		}
		// SEA MOBS
		if (this.krakens < this.gameServer.gameConfiguration.other.max_krakens) {
			this.addAnimal(EntityType_1.EntityType.KRAKEN);
			this.krakens++
		}
		if (this.fishs < this.gameServer.gameConfiguration.other.max_fishs) {
			this.addAnimal(EntityType_1.EntityType.PIRANHA);
			this.fishs++
		}
		if (this.treasure < this.gameServer.gameConfiguration.other.max_treasure && performance.now() - this.lastTreasureSpawned > 100) {
			this.addTreasure();
			this.treasure++
		}
		// DESERT MOBS
		if (this.vultures < this.gameServer.gameConfiguration.other.max_vultures) {
			this.addAnimalDesert(EntityType_1.EntityType.VULTURE);
			this.vultures++
		}
		if (this.sand_worms < this.gameServer.gameConfiguration.other.max_sand_worms) {
			this.addAnimalDesert(EntityType_1.EntityType.SAND_WORM);
			this.sand_worms++
		}
		// LAVA MOBS
		if (this.lava_dragons < this.gameServer.gameConfiguration.other.max_lava_dragons) {
			this.addAnimalLava(EntityType_1.EntityType.LAVA_DRAGON);
			this.lava_dragons++
		}
		if (this.baby_lavas < this.gameServer.gameConfiguration.other.max_baby_lavas) {
			this.addAnimalLava(EntityType_1.EntityType.BABY_LAVA);
			this.baby_lavas++
		}
		if (this.flames < this.gameServer.gameConfiguration.other.max_flames) {
			this.addAnimalLava(EntityType_1.EntityType.FLAME);
			this.flames++
		}
	}
	findFirstLocation() {
        let attempts = 0, locationState = false;
        let cx = 0;
        let cy = 0;
        //1500 1700 5000 4300
        while (attempts < 100 && locationState == false) {
            //1500 1600 5100 4400
            cx = 1500 + ~~(Math.random() * (5100 - 1500));
            cy = 1600 + ~~(Math.random() * (4400 - 1600));
            const queryBack = this.gameServer.queryManager.queryCircle(cx, cy, 80);
            if (queryBack.length == 0 /*&& !Utils.isInIsland({x: cx, y: cy})*/)
                locationState = true;
            else
                attempts++;
        }
        return attempts >= 100 ? null : [cx, cy];
    }
}
exports.WorldSpawner = WorldSpawner;
//# sourceMappingURL=WorldSpawner.js.map