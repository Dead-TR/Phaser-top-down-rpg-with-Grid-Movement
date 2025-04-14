import { Item, ItemType, OtherItems } from "type";
import { bodyItems, bowList, meleeList, otherList } from "./assets";
import { between, repeat } from "utils";

export const itemsLits: Record<ItemType, Item[]> = {
  body: [
    {
      type: "body",
      icon: bodyItems.body_1,
      name: "Грубий подертий кожух",
      protection: 1,
      description:
        "Майже не захищає, й виглядає так, мов я нап'ялив на себе мішок. Та ліпше ніж бути голим.",
      price: 15,
      id: 101,
    },
  ],
  bow: [
    {
      type: "bow",
      damage: 1,
      icon: bowList.bow_1,
      name: "Аматорський лук",
      description:
        "Лук зроблений в польових умовах. Абсолютно незручний, але ліпше аніж нічого.",
      price: 22,
      id: 201,
    },
  ],
  meleeWeapon: [
    {
      type: "meleeWeapon",
      damage: 2,
      icon: meleeList.melee_1,
      name: "Міцний дрючок",
      description: "Відламана гілка з якогось кремезного дерева.",
      price: 4,
      id: 301,
    },
  ],
  other: [
    {
      type: "other",
      item: OtherItems.picklock,
      icon: otherList.other_1,
      isUsable: false,
      name: "Відмичка",
      description: "Інструмент для взлому замків.",
      price: 40,
      id: 401,
      amount: 1,
    },
    {
      type: "other",
      item: OtherItems.etheria,
      icon: otherList.ether,
      isUsable: false,
      name: "Етерія",
      description: "Невідомого походження синій пилок. Солодкий на смак",
      price: 1,
      id: 402,
      amount: 1,
    },
  ],
  questItems: [],
  saturator: [
    {
      type: "saturator",
      isDiscovered: true,
      icon: otherList.other_1,
      name: "Намисто з кісток",
      description:
        "Купа кісток, що зрослись між собою. Від нього відчувається якась дивна енергія.",
      skills: {
        health: 120,
        move: 0.5,
      },
      price: 80,
      id: 601,
    },
  ],
};

const getRandomItems = (
  item: Item,
  repeatAmt: number,
  fromTo: [number, number],
) => {
  const [from, to] = fromTo;
  return [
    ...repeat(repeatAmt, () => {
      const itemAmt = between(from, to);
      const currentItem = { ...item };
      if (currentItem.type === "other") currentItem.amount = itemAmt;
      return currentItem;
    }),
  ];
};
export const simpleRandomItems: Item[] = [
  ...getRandomItems(itemsLits.other[1], 1, [1, 10]),
  ...getRandomItems(itemsLits.other[0], 1, [1, 3]),
  itemsLits.body[0],
  itemsLits.bow[0],
  itemsLits.meleeWeapon[0],
  itemsLits.other[0],
];

export const lockedRandomItems: Item[] = [
  ...getRandomItems(itemsLits.other[1], 3, [1, 30]),
  ...getRandomItems(itemsLits.other[0], 1, [1, 7]),
  itemsLits.body[0],
  itemsLits.bow[0],
  itemsLits.meleeWeapon[0],
  itemsLits.saturator[0],
];
