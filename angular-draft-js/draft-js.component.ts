import * as React from 'react';

import { EditorState, ContentState, convertFromHTML } from 'draft-js';

import {
  Component,
  AfterContentInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { ReactComponentWrapper } from './react.component';


export class DraftBase {
  @Input() editorClass: React.Component;
  @Input() editorProps: any = {};  // TODO: Type props?
  @Input()
  set key(key: string) {
    this.editorProps = Object.assign({}, this.editorProps, { key: key });
  }
}


export class DraftHtmlBase extends DraftBase {
  @Input()
  set html(html: string) {
    const state: EditorState = html ? this.stateFromHTML(html) : EditorState.createEmpty();
    this.editorProps = Object.assign({}, this.editorProps, { editorState: state });
  }

  @Output() htmlChange = new EventEmitter<{ string }>();

  ngOnInit() {
    this.editorProps = Object.assign({}, this.editorProps, {
      onChange: $event => { this.htmlChange.emit($event.html);
    } });
  }

  stateFromHTML(html: string) {
    const blocksFromHTML = convertFromHTML(html);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    return EditorState.createWithContent(state, this.editorProps.decorator);
  }
}


@Component({
  selector: 'draft',
  template: `
    <react-component
      [reactClass]="editorClass"
      [reactProps]="editorProps">
    </react-component>
  `,
  styleUrls: ['./draft-js.component.css'],
})
export class Draft extends DraftBase {}
