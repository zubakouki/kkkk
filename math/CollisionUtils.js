"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionUtils = void 0;
const EntityType_1 = require("../enums/EntityType");
const Utils_1 = require("../utils/Utils");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class CollisionUtils {
    static scheduleCollision(entity) {
        /**
         * Cancel collision resolver if our entity flying
         * or non-player.
         */
        if (entity.type != EntityType_1.EntityType.PLAYERS)
            return;
        if (entity.type != EntityType_1.EntityType.PLAYERS)
            return;
        /**
         * Init some vars
         */
        const queryEntities = entity.gameServer.queryManager.queryCircle(entity.x, entity.y, entity.radius), candidateEntities = [], overlappingEntities = [];
        /**
         * New position for entity
         */
        let resolvePosition;
        /**
         * Loop through all entities
         */
        for (let i = 0; i < queryEntities.length; i++) {
            const candidate = queryEntities[i];
            /**
             * Unpacking not elligble entities
             */
            if (candidate.id == entity.id || !candidate.isSolid && !entity.isFly) {
                continue;
            }
            /**
             * Entity Collide callback for building
             */
            if (Utils_1.Utils.isBuilding(candidate))
                //@ts-ignore
                if (!entity.isFly)
                    candidate.ownerClass.onCollides(entity);
            /**
             * Resolved position from collidable entities
             */
            resolvePosition = CollisionUtils.resolveCollision(entity, candidate);
            //  entity.ownerClass.ISF = true;
            // console.log(resolvePosition);
            /**
             * Candidate list
             */
            candidateEntities.push(candidate);
        }
        /**
         * If entity position contains in new list , we dont add it
         * It fixes too much entities in 1 block bug ( not stops player anymore )
         */
        for (let i = 0; i < candidateEntities.length; i++) {
            const elemtIn = overlappingEntities.find((e) => e.x == candidateEntities[i].x && e.y == candidateEntities[i].y);
            if (elemtIn != null)
                continue;
            overlappingEntities.push(candidateEntities[i]);
        }
        if (overlappingEntities.length == 1) {
            if (!entity.isFly)
                entity.x = resolvePosition.x;
            if (!entity.isFly)
                entity.y = resolvePosition.y;
            entity.ownerClass.ISF = true;
        }
        else if (overlappingEntities.length >= 2) {
            if (!entity.isFly)
                entity.x = entity.oldX;
            if (!entity.isFly)
                entity.y = entity.oldY;
            entity.ownerClass.ISF = true;
        }
        else {
            entity.ownerClass.ISF = false;
        }
        if (!entity.isFly)
            entity.collideCounter = overlappingEntities.length;
        if (overlappingEntities.length > 0)
            if (!entity.isFly && entity.ownerClass.ISF) /*console.log("aaa")*/
                entity.old_speed = serverconfig_json_1.default.entities.player.speed_collides / entity.collideCounter;
    }
    static getAngularVelocity(radius, velocity) {
        return (radius * velocity) / (radius * radius);
    }
    static resolveCollision(entity, candidate) {
        const velocity = CollisionUtils.getAngularVelocity(candidate.radius + entity.radius, entity.speed);
        let oldAngle = Math.atan2(entity.oldY - candidate.y, entity.oldX - candidate.x);
        let angle = Math.atan2(entity.y - candidate.y, entity.x - candidate.x);
        let diff = oldAngle - angle;
        if (diff === 0)
            return { x: entity.x, y: entity.y };
        if (diff > 5.8) // if(diff > 5.8) 
            return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle + velocity, entity.radius + candidate.radius);
        else if (diff < -5.8) // else if(diff < -5.8) 
            return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle - velocity, entity.radius + candidate.radius);
        if (diff > 0)
            return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle - velocity, entity.radius + candidate.radius);
        return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle + velocity, entity.radius + candidate.radius);
        /*
                const velocity = CollisionUtils.getAngularVelocity(candidate.radius + entity.radius , entity.speed)
                
                let oldAngle = Math.atan2(entity.oldY - candidate.y , entity.oldX - candidate.x);
                let angle = Math.atan2(entity.y - candidate.y, entity.x - candidate.x);
                let diff = oldAngle - angle;
           console.log(oldAngle+":"+angle)
                if(diff === 0 )
                    return {x: entity.x , y: entity.y};
            
                if(diff > 5.8) // if(diff > 5.8)
                
                    return Utils.getPointOnCircle(candidate.x , candidate.y, oldAngle + velocity, entity.radius + candidate.radius);
                else if(diff < -5.8) // else if(diff < -5.8)
                
                    return Utils.getPointOnCircle(candidate.x , candidate.y , oldAngle - velocity, entity.radius + candidate.radius);
                
                if(diff >= 0)
                    return Utils.getPointOnCircle(candidate.x , candidate.y , oldAngle - velocity, entity.radius + candidate.radius);
        
                return Utils.getPointOnCircle(candidate.x , candidate.y , oldAngle + velocity, entity.radius + candidate.radius);
           */
    }
}
exports.CollisionUtils = CollisionUtils;
