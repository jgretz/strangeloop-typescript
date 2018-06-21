import { AssertAssignable } from "../util";

test("has type inference", () => {
  /**
   * TypeScript infers the types of variables.
   * Hover over these variable declarations to see them.
   */

  let hello = "hello world";

  let isTypeScriptTime = true;

  let oneAndAHalf = 1.5;

  let arrayOfFruits = ["apple", "orange", "pear"];

  let arrayOfBools = [true, false];
});

test("and type annotations", () => {
  /**
   * Rather than letting TS infer the types, we can add
   * type annotations that explicitly describe the variable type.
   */

  let hello: string = "hello world";

  let isTypeScriptTime: boolean = true;

  let oneAndAHalf: number = 1.5;

  let arrayOfFruits: string[] = ["apple", "orange", "pear"];

  let arrayOfBools: boolean[] = [true, false];
});

test("types enforce constraints", () => {
  /**
   * Once a variable has a type, the type checker will fail
   * if we try to assign it to a value of a different type.
   */
  let hello: string = "a string";

  // typings:expect-error
  hello = 5;

  /**
   * Type annotations are useful because they allow us to
   * express our intent to TypeScript, so it can catch mistakes.
   */
  // typings:expect-error
  let shouldBeAString: string = true;
});

test("object types", () => {
  /**
   * TypeScript gets more interesting when we introduce structural typing.
   * We can describe object shapes as types.
   */
  let fruit: { name: string; color: string } = { name: "apple", color: "red" };

  // typings:expect-error
  let notAFruit: { name: string; color: string } = { color: "red" };
  // typings:expect-error
  let stillNotAFruit: { name: string; color: string } = "hello";
  // typings:expect-error
  let reallyNotAFruit: { name: string; color: string } = { foo: false };
});
test("type aliases", () => {
  /**
   * These types are a little more complicated to write than the primatives.
   * What if we want to use them again? We can describe aliases for types,
   * and we can use them anywhere that we would use a type.
   */
  type Fruit = { name: string; color: string };

  let strawberry: Fruit = { color: "red", name: "Strawberry" };
  let lemon: Fruit = { color: "yellow", name: "Lemon" };

  // typings:expect-error
  let plate: Fruit = { size: "small", color: "blue" };
});

test("interfaces", () => {
  /**
   * Interfaces are another way to describe object types.
   * Functionally speaking, they operate just like a type
   * alias for an object. There are some subtle differences
   * in how error messages are formatted, and a few other
   * differences we'll touch on later, but for now you can
   * think of these syntaxes as interchangeable.
   */
  type FoodItemAlias = {
    name: string;
    cost: {
      dollars: number;
      cents: number;
    };
  };

  interface FoodItemInterface {
    name: string;
    cost: {
      dollars: number;
      cents: number;
    };
  }

  let muffin: FoodItemAlias = {
    cost: { cents: 50, dollars: 3 },
    name: "Muffin"
  };
  let altMuffin: FoodItemInterface = {
    cost: { cents: 50, dollars: 3 },
    name: "Muffin"
  };

  // typings:expect-error
  let notAFoodItem: FoodItemAlias = {
    name: "plate"
  };

  /**
   * Remember that you can use any kind of type definition
   * anywhere that you would use the others.
   */
  type Money = {
    dollars: number;
    cents: number;
  };

  type AltFoodItem = {
    name: string;
    cost: Money;
  };

  let altAltMuffin: AltFoodItem = {
    cost: { cents: 50, dollars: 3 },
    name: "Muffin"
  };
});

test("function types", () => {
  /**
   * Type annotations get more powerful when we start using
   * them with functions. Check out the type of declareFavoriteFood.
   */
  function declareFavoriteFood(name: string, food: string) {
    return `${name}'s favorite food is ${food}.`;
  }
  /** TS knows the return type of declareFavoriteFood. */
  let waldosFavorite = declareFavoriteFood("Waldo", "chips");
  /**
   * If we try to pass a value of the wrong type as an arg, we'll 
   * get an error- just like we did when assigning a variable 
   * to the wrong type.
   */
  // typings:expect-error
  let invalidInput = declareFavoriteFood("Waldo", true);

  /**
   * We can describe the type of the _function_, too.
   */
  let declarationFunction: (
    name: string,
    food: string
  ) => string = declareFavoriteFood;

  let declareNotLikeFood: (name: string, food: string) => string = (
    name: string,
    food: string
  ) => {
    return `${name} doesn't like ${food}.`;
  };

  /** 
   * Being able to describe function signatures as types
   * makes it much easier to treat functions like data. 
   */
  function announceFeelings(foodFeelings: (name: string, food: string) => string) {
    const result = foodFeelings("Rachael", "bell peppers");
    return `I asked, and ${result}`
  }

  expect(announceFeelings(declareFavoriteFood)).toEqual("I asked, and Rachael's favorite food is bell peppers.")
  expect(announceFeelings(declareNotLikeFood)).toEqual("I asked, and Rachael doesn't like bell peppers.")
});

test("the 'any' type", () => {
  /**
   * TS uses the keyword 'any' for a type that could be anything.
   */
  let anything: any = "foo";
  anything = true;
  anything = 5;

  /**
   * In this example, we haven't told TS what the args of this function
   * should be, so it infers them to be 'any'. Implicit 'any' types
   * aren't allowed for function args, so we get an error:
   */
  // typings:expect-error
  function declareFavoriteFood(name, food) {
    return `${name}'s favorite food is ${food}`;
  }

  /** But it does allow _explicit_ any for function args: */
  function typedDeclareFavoriteFood(name: any, food: any) {
    return `${name}'s favorite food is ${food}`;
  }
  /**
   * Using 'any' is risky, because it effectively disables
   * type checking:
   * */
  let thisWillBlowUp = typedDeclareFavoriteFood(null, 2);

  /** We'll come back to 'any' in the next exercise. */
});

test("structural compatibility", () => {
  /**
   * Type annotations are just there to help us describe object shapes.
   * We can use differently named types interchangably, as long as they
   * are structurally compatible.
   */
  interface DeliItem {
    name: string;
    cost: number;
  }
  interface BakeryItem {
    name: string;
    cost: number;
  }

  let lunchMeat: DeliItem = {
    name: "Sliced Turkey",
    cost: 3
  };

  let croissant: BakeryItem = {
    name: "Croissant",
    cost: 2
  };

  function bakeryPriceStatement(item: BakeryItem) {
    return `That fresh-baked ${item.name} will be $${item.cost}.`;
  }

  function deliPriceStatement(item: DeliItem) {
    return `That juicy ${item.name} will be $${item.cost}.`;
  }

  // We can substitute one type for another anytime they're structurally compatible
  let freshBakedCheese = bakeryPriceStatement(lunchMeat);
  let juicyCroissant = deliPriceStatement(croissant);

  // Or even anonymous types
  let mysteryMeat = deliPriceStatement({ name: "Mystery Meat", cost: 1 });

  interface FlavoredFoodItem {
    name: string;
    cost: number;
    flavorProfile: string;
  }

  let cheezits: FlavoredFoodItem = {
    name: "Box of Cheezits",
    cost: 4,
    flavorProfile: "salty"
  };

  /**
   * Flavored food is structurally compatible with regular food because
   * its properties are a superset of regular food's.
   */
  let freshBakedCheezits = bakeryPriceStatement(cheezits);

  function flavoredFoodPriceStatement(item: FlavoredFoodItem) {
    return `That ${item.flavorProfile} ${item.name} will be $${item.cost}.`;
  }

  // But regular food isn't assignable to a type that expects flavored food
  // typings:expect-error
  let noCroissants = flavoredFoodPriceStatement(croissant);

  // In the future, we'll use AssertAssignable to prove structural compatibility or lack thereof:
  type _t1 = AssertAssignable<BakeryItem, FlavoredFoodItem>;
  // typings:expect-error
  type _t2 = AssertAssignable<FlavoredFoodItem, BakeryItem>;
});

test("Writing our own types", () => {
  /**
   * Let's write a few types that enforce constraints.
   */
  type FixThisType = any;
  const jaime: FixThisType = "Jaime"
  const meredith: FixThisType = "Meredith"
  // typings:expect-error
  const yes: FixThisType = true;

  type FixThisOneToo = any;
  const nellie = { type: "dog", disposition: "good" }
  const roxy = { type: "dog", disposition: "aloof" }
  // typings:expect-error
  const friday = { type: "cat", fluffy: "very" }
  // typings:expect-error
  const cauchy = { type: "cat", fluffy: "not really" }

  type AndThisOne = any;
  const sayHello: AndThisOne = (name: string) => { return `Hello, ${name}.`}
  const sayGoodbye: AndThisOne = (name: string) => { return `Goodbye, ${name}.`}
  // typings:expect-error
  const isFido: AndThisOne = (name: string) => { return name === "Fido"};

})
