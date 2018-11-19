import DropOrPasteImages from 'slate-drop-or-paste-images'
import React from 'react'
import initialValue from './value.json'
import { Editor } from 'slate-react'
import { Value } from 'slate'

/**
 * Image node renderer.
 *
 * @type {Component}
 */

class Image extends React.Component {
  state = {}

  componentDidMount() {
    const { node } = this.props
    const { data } = node
    const file = data.get('file')
    this.load(file)
  }

  load(file) {
    const reader = new FileReader()
    reader.addEventListener('load', () => this.setState({ src: reader.result }))
    reader.readAsDataURL(file)
  }

  render() {
    const { attributes } = this.props
    const { src } = this.state
    return src ? (
      <img {...attributes} src={src} />
    ) : (
      <div {...attributes}>Loading...</div>
    )
  }
}

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {
  plugins = [
    DropOrPasteImages({
      insertImage: (transform, file) => {
        return transform.insertBlock({
          type: 'image',
          isVoid: true,
          data: { file },
        })
      },
    }),
  ]

  state = {
    value: Value.fromJSON(initialValue),
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }
  schema = {
    blocks: {
      image: {
        isVoid: true
      }
    }
  };
  render() {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        onChange={this.onChange}
        renderNode={this.renderNode}
        schema={this.schema}
      />
    )
  }

  renderNode(props, editor, next) {
    switch (props.node.type) {
      case 'image':
        return <div><Image {...props} />{props.node.children}</div>
      default:
        return next()
    }
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Example
