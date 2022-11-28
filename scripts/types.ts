export type RawInventory = (ItemStack | undefined)[];

export interface World {
  getDimension(dimensionId: string): Dimension;
  /**
   * @remarks
   * Returns all players currently in the world.
   * @param options
   * @returns
   * All players currently in the world.
   * @throws This function can throw errors.
   */
  getPlayers(): PlayerIterator;
}

export interface Dimension {
  runCommandAsync(commandString: string): Promise<unknown>;
}
/**
 * This type is usable for iterating over a set of players.
 * This means it can be used in statements like for...of
 * statements, Array.from(iterator), and more.
 */
export interface PlayerIterator {
  [Symbol.iterator](): Iterator<unknown>;
  /**
   * @remarks
   * Retrieves the next item in this iteration. The resulting
   * IteratorResult contains .done and .value properties which
   * can be used to see the next Player in the iteration.
   */
  next(): IteratorResult<unknown>;
  // protected constructor();
}

/**
 * How many times the server ticks per second of real time.
 */
export const TicksPerSecond = 20;

/**
 * Defines a collection of items.
 */
export interface ItemStack {
  /**
   * Number of the items in the stack. Valid values range between
   * 0 and 64.
   */
  amount: number;
  readonly typeId: string;
}

/**
 * Represents a container that can hold stacks of items. Used
 * for entities like players, chest minecarts, llamas, and
 * more.
 */
export interface InventoryComponentContainer {
  /**
   * The number of empty slots in the container.
   * @throws This property can throw when used.
   */
  readonly emptySlotsCount: number;
  /**
   * Represents the size of the container. For example, a
   * standard single-block chest has a size of 27, for the 27
   * slots in their inventory.
   * @throws This property can throw when used.
   */
  readonly size: number;
  /**
   * @remarks
   * Adds an item to the specified container. Items will be
   * placed in the first available empty slot. (Use {@link
   * InventoryComponentContainer.setItem} if you wish to set
   * items in a particular slot.)
   * @param itemStack
   * The stack of items to add.
   * @throws This function can throw errors.
   */
  addItem(itemStack: ItemStack): void;
  /**
   * @remarks
   * Gets the item stack for the set of items at the specified
   * slot. If the slot is empty, returns undefined. This method
   * does not change or clear the contents of the specified slot.
   * @param slot
   * Zero-based index of the slot to retrieve items from.
   * @throws This function can throw errors.
   * @example getItem.js
   * ```typescript
   *        const itemStack = rightChestContainer.getItem(0);
   *        test.assert(itemStack.id === "apple", "Expected apple");
   *        test.assert(itemStack.amount === 10, "Expected 10 apples");
   * ```
   */
  getItem(slot: number): ItemStack | undefined;
  /**
   * @remarks
   * Sets an item stack within a particular slot.
   * @param slot
   * Zero-based index of the slot to set an item at.
   * @param itemStack
   * Stack of items to place within the specified slot.
   * @throws This function can throw errors.
   */
  setItem(slot: number, itemStack: ItemStack): void;
  /**
   * @remarks
   * Swaps items between two different slots within containers.
   * @param slot
   * Zero-based index of the slot to swap from this container.
   * @param otherSlot
   * Zero-based index of the slot to swap with.
   * @param otherContainer
   * Target container to swap with. Note this can be the same
   * container as this source.
   * @throws This function can throw errors.
   * @example swapItems.js
   * ```typescript
   *        rightChestContainer.swapItems(1, 0, leftChestContainer); // swap the cake and emerald
   *
   * ```
   */
  // swapItems(slot: number, otherSlot: number, otherContainer: Container): boolean;
  /**
   * @remarks
   * Moves an item from one slot to another, potentially across
   * containers.
   * @param fromSlot
   * @param toSlot
   * Zero-based index of the slot to move to.
   * @param toContainer
   * Target container to transfer to. Note this can be the same
   * container as the source.
   * @throws This function can throw errors.
   * @example transferItem.js
   * ```typescript
   *        rightChestContainer.transferItem(0, 4, chestCartContainer); // transfer the apple from the right chest to a chest cart
   *
   * ```
   */
  // transferItem(fromSlot: number, toSlot: number, toContainer: Container): boolean;
}
