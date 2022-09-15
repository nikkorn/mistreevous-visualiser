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
        return getNumberValue("How many dollars do we have?") >= amount;
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

    {
        caption: "Action with arguments",
        category: "leaf",
        definition: `root {
    action [Say, "hello world", 5, true]
}`,
        board: `class Board {
    Say(dialog, times = 1, shout = false) {
        for (var index = 0; index < times; index++) {
            showInfoToast(shout ? dialog.toUpperCase() + "!!!" : dialog);
        }
        return State.SUCCEEDED;
    }
}`
    },

    {
        caption: "Asynchronous Action",
        category: "leaf",
        definition: `root {
    action [SomeAsyncAction]
}`,
        board: `class Board {
    SomeAsyncAction() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(State.SUCCEEDED);
            }, 3000);
        });
    }
}`
    },

    {
        caption: "Condition",
        category: "leaf",
        definition: `root {
    condition [SomeCondition]
}`,
        board: `class Board {
    SomeCondition() {
        return true;
    }
}`
    },

    {
        caption: "Condition with arguments",
        category: "leaf",
        definition: `root {
    condition [HasItem, "gold", 500]
}`,
        board: `class Board {
    HasItem(item, quantity = 1) {
        return getBooleanValue(\`Do we have \${quantity} \${item}?\`);
    }
}`
    },

    {
        caption: "Wait",
        category: "leaf",
        definition: `root {
    wait [2000]
}`,
        board: `class Board {}`
    },

    {
        caption: "Wait for one-five seconds",
        category: "leaf",
        definition: `root {
    wait [1000, 5000]
}`,
        board: `class Board {}`
    },

    {
        caption: "Sequence",
        category: "composite",
        definition: `root {
    sequence {
        action [Walk]
        wait [1000]
        action [Fall]
        wait [1000]
        action [Laugh]
    }
}`,
        board: `class Board {
    Walk() {
        showInfoToast("Walking!");
        return State.SUCCEEDED;
    }
    Fall() {
        showInfoToast("Falling!");
        return State.SUCCEEDED;
    }
    Laugh() {
        showInfoToast("Laughing!");
        return State.SUCCEEDED;
    }
}`
    },

    {
        caption: "Selector",
        category: "composite",
        definition: `root {
    selector {
        action [TeleportHome]
        action [FlyHome]
        action [DriveHome]
        action [WalkHome]
    }
}`,
        board: `class Board {
    TeleportHome() {
        showErrorToast("We cannot teleport home, the technology simply doesn't exist!");
        return State.FAILED;
    }
    FlyHome() {
        showErrorToast("We can't afford a plane ticket!");
        return State.FAILED;
    }
    DriveHome() {
        showInfoToast("We have a car, we drive home!");
        return State.SUCCEEDED;
    }
    WalkHome() {
        showInfoToast("We walk home, it took ages!");
        return State.SUCCEEDED;
    }
}`
    },

    {
        caption: "Lotto",
        category: "composite",
        definition: `root {
    lotto {
        action [PickPath, "left"]
        action [PickPath, "right"]
    }
}`,
        board: `class Board {
    PickPath(direction) {
        showInfoToast(\`We picked the \${direction} path!\`);
        return State.SUCCEEDED;
    }
}`
    },

    {
        caption: "Weighted Lotto",
        category: "composite",
        definition: `root {
    lotto [20,10,3,1] {
        action [CommonAction]
        action [UncommonAction]
        action [RareAction]
        action [VeryRareAction]
    }
}`,
        board: `class Board {
    CommonAction() {
        showInfoToast("We very often do this action!");
        return State.SUCCEEDED;
    }
    UncommonAction() {
        showInfoToast("We sometimes do this action!");
        return State.SUCCEEDED;
    }
    RareAction() {
        showInfoToast("We do not do this action very often!");
        return State.SUCCEEDED;
    }
    VeryRareAction() {
        showInfoToast("We hardly ever do this action!");
        return State.SUCCEEDED;
    }
}`
    },

    {
        caption: "Parallel",
        category: "composite",
        definition: `root {
    parallel {
        sequence {
            wait[500, 2500]
            wait[500, 2500]
            wait[500, 2500]
            action [Succeed]
        }
        sequence {
            wait[500, 2500]
            wait[500, 2500]
            wait[500, 2500]
            action [Fail]
        }
    }
}`,
        board: `class Board {
    Succeed() {
        return State.SUCCEEDED;
    }
    Fail() {
        return State.FAILED;
    }
}`
    },
];