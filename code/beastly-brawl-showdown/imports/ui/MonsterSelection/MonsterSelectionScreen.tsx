import React from "react";
import { MonsterContainer } from "./MonsterContainer";
import { useNavigate } from "react-router-dom";

/**
 * Confirms the monster the player will be using and all function that this button needs
 * @returns HTML button component to confirm monster selection
 */
function ConfirmButton() {
    const navigate = useNavigate();
    return (
        <button className="glb-btn" id="monster-selection-btn" disabled onClick={() => navigate("/play")}>
            Confirm
        </button>
    );
}

export const MonsterSelectionScreen = () => {
    // Name of currently selected monster
    let currentlySelected: string;

    /**
     * Enable confirm button and border the selected monster
     * @param {string} name
     */
    function highlightAndShowConfirm(name: string) {
        if (currentlySelected) {
            // Deselect currently selected item
            const deselect = document.getElementById(currentlySelected);
            if (deselect) {
                deselect.classList.remove('selected');
            }
        }

        // Create border around selected mosnter
        const selected = document.getElementById(name);
        if (selected) {
            selected.classList.add('selected');
        }

        currentlySelected = name;

        // Enable confirm button once an option has been selected
        const confirmButton = document.getElementById("confirmMonsterButton") as HTMLButtonElement;
        if (confirmButton) {
            confirmButton.disabled = false;
            confirmButton.style.cursor = "default";
        }
    }

    return (
        <div className="canvas-body" id="monster-selection-screen">
            <h1 className="monster-selection-screen-title">Choose Your</h1>
            <h1 className="monster-selection-screen-title" id="header-2">Monster!</h1>
            <div className="monster-selection-grid">
                <MonsterContainer name="monster1" type="Attacker" func={highlightAndShowConfirm} />
                <MonsterContainer name="monster2" type="Defender" func={highlightAndShowConfirm} />
                <MonsterContainer name="monster3" type="Balanced" func={highlightAndShowConfirm} />
                <ConfirmButton />
            </div>   
        </div>
    );
};
