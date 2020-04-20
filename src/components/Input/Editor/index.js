import React from 'react';
import { Button, Divider } from 'antd';
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from 'draft-js';

// Custom overrides for "code" style.
const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2
	}
};

function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote';
		default:
			return null;
	}
}

class StyleButton extends React.Component {
	constructor() {
		super();
		this.onToggle = e => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}

	render() {
		let className = 'RichEditor-styleButton';
		if (this.props.active) {
			className += ' RichEditor-activeButton';
		}

		return (
			<span className={className} onMouseDown={this.onToggle}>
				{this.props.label}
			</span>
		);
	}
}

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: 'H4', style: 'header-four' },
	{ label: 'H5', style: 'header-five' },
	{ label: 'H6', style: 'header-six' },
	{ label: 'Blockquote', style: 'blockquote' },
	{ label: 'UL', style: 'unordered-list-item' },
	{ label: 'OL', style: 'ordered-list-item' },
	{ label: 'Code Block', style: 'code-block' }
];

const BlockStyleControls = props => {
	const { editorState } = props;
	const selection = editorState.getSelection();
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType();

	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map(type => (
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};

const INLINE_STYLES = [
	{ label: 'Bold', style: 'BOLD' },
	{ label: 'Italic', style: 'ITALIC' },
	{ label: 'Underline', style: 'UNDERLINE' },
	{ label: 'Monospace', style: 'CODE' }
];

const InlineStyleControls = props => {
	const currentStyle = props.editorState.getCurrentInlineStyle();

	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map(type => (
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};

class RichEditorExample extends React.Component {
	constructor(props) {
		super(props);
		// const plainText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.';
		// const content = ContentState.createFromText(props.defaultValue);
		const content = convertFromRaw(JSON.parse(props.defaultValue));

		this.state = {
			editorState: EditorState.createWithContent(content),
			// editorState: EditorState.createWithContent(
			// 	ContentState.createFromText(
			// 	  `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."`
			// 	)
			//   )
			isEdit: false
		};

		this.focus = () => this.refs.editor.focus();
		this.onChange = editorState =>
			this.setState({ editorState, editorContentHtml: stateToHTML(editorState.getCurrentContent()) });
	}

	handleKeyCommand = command => {
		const { editorState } = this.state;
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	};

	onTab = e => {
		const maxDepth = 4;
		this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
	};

	toggleBlockType = blockType => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
	};

	toggleInlineStyle = inlineStyle => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
	};

	handleChange(value) {
		this.setState({ text: value });
	}

	handelSave(value) {
		const { alias } = this.props;
		const { editorState } = this.state;
		const content = convertToRaw(editorState.getCurrentContent());
		const rawContent = JSON.stringify(content);
		this.props.handleUpdateMetadata(alias, rawContent);
	}

	render() {
		const { editorState, isEdit } = this.state;

		// If the user changes block type before entering any text, we can
		// either style the placeholder or hide it. Let's just hide it now.
		let className = 'RichEditor-editor';
		const contentState = editorState.getCurrentContent();

		if (!contentState.hasText()) {
			if (
				contentState
					.getBlockMap()
					.first()
					.getType() !== 'unstyled'
			) {
				className += ' RichEditor-hidePlaceholder';
			}
		}

		return (
			<>
				<div style={{ marginBottom: '10px' }}>
					{!this.state.isEdit ? (
						<Button
							// className={[classes.btnEditSave]}
							icon="edit"
							type="ghost"
							onClick={() => {
								this.setState({ isEdit: true });
							}}>
							Edit
						</Button>
					) : (
						<>
							<Button
								// className={[classes.btnEditSave]}
								icon="save"
								type="ghost"
								onClick={() => {
									this.handelSave();
									// handleUpdateMetadata(getId(each.key), getContent(each.key));
									this.setState({ isEdit: false });
								}}>
								Save
							</Button>{' '}
							<Button
								// className={[classes.btnEditSave]}
								icon="close-circle"
								type="ghost"
								onClick={() => {
									// handleUpdateMetadata(getId(each.key), getContent(each.key));
									// const content = ContentState.createFromText(this.props.defaultValue);
									const content = convertFromRaw(JSON.parse(this.props.defaultValue));
									this.setState({
										editorState: EditorState.createWithContent(content),
										isEdit: false
									});
								}}>
								Cancel
							</Button>
						</>
					)}
				</div>
				<div className="RichEditor-root">
					{isEdit && (
						<>
							<BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />
							<InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} />
							<Divider />
						</>
					)}

					<div className={className} onClick={this.focus}>
						<Editor
							blockStyleFn={getBlockStyle}
							customStyleMap={styleMap}
							editorState={editorState}
							handleKeyCommand={this.handleKeyCommand}
							onChange={this.onChange}
							onTab={this.onTab}
							ref="editor"
							readOnly={!isEdit}
							spellCheck={true}
						/>
					</div>
				</div>
				{/* <pre>{this.state.editorContentHtml}</pre> */}
			</>
		);
	}
}

export default RichEditorExample;
