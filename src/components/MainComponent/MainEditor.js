import React from "react";
import { renderBlock, renderMark } from "components/SlateJS";
import { Editor } from "slate-react";

// Mobile is having a lot of issues, so try switching to a PureComponent to see if it alleviates anything

export class MainEditor extends React.PureComponent {
  onFocus = () => {};

  render() {
    const props = this.props;

    return (
      <Editor
        spellCheck
        value={props.editorValue}
        onChange={props.onTextChange}
        // true will make the cursor point to this when page loads
        autoFocus={true}
        ref={props.reference}
        onKeyDown={props.onKeyDown}
        onFocus={this.onFocus}
        renderBlock={renderBlock}
        renderMark={renderMark}
      />
    );
  }
}
