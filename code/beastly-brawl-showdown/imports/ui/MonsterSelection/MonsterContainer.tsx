import React from "react";

// export const MonsterContainer = ({image, name, func}: {image: string, name: string, func: (name: string) => void}) => {
export const MonsterContainer = ({name, type, func}: {name: string, type: string, func: (name: string) => void}) => {
    /**
     * Onclick handler
     */
    function onClick() {
        func(name);
    }

    return (
        <div className="monster-selection-card" id={name} onClick={onClick}>
            <div className="monster-avatar">🔥</div>
            <div className="monster-selection-card-info">
                {/* All of these are placeholder texts */}
                <div className="monster-name">{name}</div>
                <div className="monster-type">{type}</div>
                <div className="monster-desc">A fierce dragon-like creature with burning claws</div>
                <div className="ability-desc">Ability: Ignite - Burns enemies on contact</div>
            </div>
        </div>
    )
}   