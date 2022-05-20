(() => {
	const MIN_INPUT_LENGTH = 300;

	function highlight(text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")

			.replace(/&lt;=/g, "\x01≤\x00")
			.replace(/&gt;=/g, "\x01≥\x00")
			.replace(/!=/g, "\x01≠\x00")
			.replace(/:=/g, "\x01\x09:\x00=\x00")
			.replace(/-&gt;&gt;/g, "\x01\x08&#x21a0;\x00\x07&beta;\x00\x00")
			.replace(/-&gt;/g, "\x01\x08&rightarrow;\x00\x07&beta;\x00\x00")
			.replace(/=b/g, "\x01\x08=\x00\x07&beta;\x00\x00")
			.replace(/(&lt;|&gt;|[=+\-*\/^:]|\.\.\.)/g, `\x01$1\x00`)
			.replace(/\*/g, "·")
			.replace(/(\\\s*)([a-zA-Z][a-zA-Z0-9]*)/g, `$1\x02$2\x00`)
			.replace(/([a-zA-Z][a-zA-Z0-9]*\s*\(\s*)([a-zA-Z][a-zA-Z0-9]*)(\s*\)\s*\x01=)/g, `$1\x02$2\x00$3`)
			.replace(/\\/g, `\x03λ\x00`)
			.replace(/\.(?![ \t.\x00])/g, `\x04.\x00`)
			.replace(/\b([a-zA-Z][a-zA-Z0-9]*)((?:[ \t]*\(|[ \t]+[a-zA-Z0-9]+)+)/g, `\x05$1\x00$2`)
			.replace(/\b(\d+)\b/g, `\x06$1\x00`)
			.replace(/\bi\b/g, "&iota;")

			.replace(/\x00/g, "</span>")
			.replace(/\x01/g, `<span class="token-operator">`)
			.replace(/\x02/g, `<span class="token-argument">`)
			.replace(/\x03/g, `<span class="token-lambda">`)
			.replace(/\x04/g, `<span class="token-point">`)
			.replace(/\x05/g, `<span class="token-name">`)
			.replace(/\x06/g, `<span class="token-literal">`)
			.replace(/\x07/g, `<span class="beta-subscript">`)
			.replace(/\x08/g, `<span class="pre-beta-superscript">`)
			.replace(/\x09/g, `<span class="token-colon">`);
	}


	function updateInputHighlighting(node, input, field) {
		const value = input.value;

		// if(value !== input.value) {
		// 	const selectionStart = input.selectionStart;
		// 	const selectionEnd = input.selectionEnd;
		// 	const selectionDirection = input.selectionDirection;
		// 	input.value = value;
		// 	input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
		// }

		field.innerHTML = highlight(value);
		node.style.width = Math.max(MIN_INPUT_LENGTH, field.scrollWidth) + "px";
	}


	function initInputHighlighting(node) {
		const input = node.querySelector("input[type=text]");
		const field = node.querySelector(".highlighted-value");

		updateInputHighlighting(node, input, field);

		input.addEventListener("input", () => {
			updateInputHighlighting(node, input, field);
		});

		input.addEventListener("keypress", e => {
			if(e.key === "(") {
				const selectionStart = input.selectionStart;
				const selectionEnd = input.selectionEnd;
				const selectionDirection = input.selectionDirection;

				if(selectionStart === selectionEnd) {
					if(document.execCommand("insertText", false, "()")) {
						input.setSelectionRange(selectionStart + 1, selectionEnd + 1, selectionDirection);
						e.preventDefault();
					}
				} else {
					const selection = input.value.slice(selectionStart, selectionEnd);
					if(document.execCommand("insertText", false, `(${selection})`)) {
						input.setSelectionRange(selectionStart + 1, selectionEnd + 1, selectionDirection);
						e.preventDefault();
					}
				}
			}
		});
	}

	function highlightCodeNode(node) {
		node.innerHTML = highlight(node.textContent);
	}


	for(const node of document.querySelectorAll(".highlighted-input")) {
		initInputHighlighting(node);
	}
	for(const node of document.querySelectorAll("pre")) {
		highlightCodeNode(node);
	}
	for(const node of document.querySelectorAll("code")) {
		highlightCodeNode(node);
	}
})();