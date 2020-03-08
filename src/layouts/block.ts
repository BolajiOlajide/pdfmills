import sumBy from "lodash/sumBy";
import { BlockStyle, BoundingBox, Context, Element } from "../base";
import { removeMargins } from "../base/boundingBox";

/**
 * This arranges all it's element on a vertical line using the width
 * of its bounding box.
 */
export class Block implements Element {
  /**
   * Create a new block layout.
   * @param style background and margin for the block
   * @param elements list of elements to layout
   */
  constructor(protected style: BlockStyle, protected elements: Element[]) {}

  width(_context: Context, box: BoundingBox): number {
    return box.width;
  }

  height(context: Context, box: BoundingBox): number {
    return Math.ceil(sumBy(this.elements, e => e.height(context, box)));
  }

  draw(context: Context, box: BoundingBox): void {
    const boxes = this.boxes(context, box);

    this?.style?.background?.draw(context, box);

    this.elements.forEach((el, i) => {
      el.draw(context, boxes[i]);
    });
  }

  protected boxes(context: Context, box: BoundingBox): BoundingBox[] {
    box = removeMargins(box, this.style.margin);

    const boxes: BoundingBox[] = [];

    let y = box.y;
    let remaningHeight = box.height;

    for (const el of this.elements) {
      const height = el.height(context, {
        x: box.x,
        y,
        width: box.width,
        height: remaningHeight
      });

      boxes.push({ ...box, y, height });

      y += height;
      remaningHeight -= height;
    }

    return boxes;
  }
}
