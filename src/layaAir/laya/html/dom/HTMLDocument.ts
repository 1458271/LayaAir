import { HTMLElement } from "./HTMLElement";
import { HTMLStyle } from "../utils/HTMLStyle"

/**
 * @private
 */
export class HTMLDocument {
	static document: HTMLDocument = new HTMLDocument();
	all: HTMLElement[] = [];
	styleSheets: any = HTMLStyle.styleSheets;

	//TODO:coverage
	getElementById(id: string): HTMLElement {
		return this.all[id];
	}

	//TODO:coverage
	setElementById(id: string, e: HTMLElement): void {
		this.all[id] = e;
	}
}

