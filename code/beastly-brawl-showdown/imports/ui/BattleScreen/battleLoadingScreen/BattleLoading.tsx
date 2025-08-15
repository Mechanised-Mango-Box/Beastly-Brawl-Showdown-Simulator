import React from "react"
import { PlayerAvater } from "./PlayerAvatar"

export const BattleLoadingScreen = () => {
    return (
        <div className="battle-loading-screen">
            <div className="battle-loading-container">
                <PlayerAvater />
                <div className="vs-text">VS</div>
                <PlayerAvater />
            </div>
        </div>
    )
}