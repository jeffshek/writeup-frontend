import React, { Fragment } from "react";
import { renderBlock, renderMark } from "components/SlateJS";
import { Editor } from "slate-react";

// Mobile is having a lot of issues, so try switching to a PureComponent to see if it alleviates anything

export class MainEditor extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;

    return (
      <Editor
        spellCheck
        value={props.editorValue}
        onChange={props.onTextChange}
        autoFocus={true}
        ref={props.reference}
        onKeyDown={props.onKeyDown}
        renderBlock={renderBlock}
        renderMark={renderMark}
      />
    );
  }
}
