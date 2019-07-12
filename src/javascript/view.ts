interface IElementData {
	tagName: string;
	className?: string;
	attributes?: any;
}

class View {
	element: any;

	// createElement({ tagName: string, className = '', attributes = {} }): HTMLElement {
	createElement({ tagName, className = '', attributes = {} }: IElementData): HTMLElement {
		const element = document.createElement(tagName);

		if (className) {
			element.classList.add(...(className.split(' ')));
		}

		Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

		return element;
	}
}

export default View;
