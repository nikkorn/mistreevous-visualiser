/**
 * An example definition and board commbination.
 */
 export type ExampleCategory = "misc" | "leaf" | "composite" | "decorator" | "guard-callback";

/**
 * An example definition and board commbination.
 */
export type Example = {
    caption: string;
    category: ExampleCategory;
    definition: string;
    board: string;
};

/**
 * An array of example definition and board commbinations.
 */
export const Examples: Example[] = [
    {
        caption: "Empty",
        category: "misc",
        definition: `root {
}`,
        board: `class Board {
}`
    },
    
    {
        caption: "Sorting Lunch",
        category: "misc",
        definition: `root {
    selector while(IsHungry) {
        sequence {
            condition [HasDollars, 15]
            action [OrderFood, "Pizza"]
        }
        sequence {
            condition [HasIngredient, "Steak"]
            condition [HasIngredient, "Lobster"]
            action [CookFood, "Surf 'n' Turf"]
        }
        sequence {
            condition [HasIngredient, "Egg"]
            lotto {
                action [CookFood, "Omelette"]
                action [CookFood, "Scrambled Eggs"]
                action [CookFood, "Fried Eggs"]
            }
        }
        sequence {
            condition [HasIngredient, "Oats"]
            action [CookFood, "Gruel"]
        }
        action [Starve]
    }
}`,
        board: `class Board {
    IsHungry() {
        return true;
    }
    HasDollars(amount) {
        return getNumberValue("How much money do we have?") >= amount;
    }
    HasIngredient(ingredient) {
        return getBooleanValue(\`Do we have \${ingredient}?\`);
    }
    OrderFood(foodType) {
        showInfoToast(\`Ordered \${foodType}!\`);
        return State.SUCCEEDED;
    }
    CookFood(foodType) {
        showInfoToast(\`We are cooking \${foodType}!\`);
        return State.SUCCEEDED;
    }
    Starve() {
        showErrorToast(\`Oh no! We Starved!\`);
        return State.SUCCEEDED;
    }
}`
    },

    {
        caption: "Action",
        category: "leaf",
        definition: `root {
    action [SomeAction]
}`,
        board: `class Board {
    SomeAction() {
        showInfoToast("Action Completed!");
        return State.SUCCEEDED;
    }
}`
    },
];