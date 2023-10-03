import { useState, useRef } from 'react'
import Editor from "@monaco-editor/react"
import * as Y from "yjs"
import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from "../libs/y-monaco"
import { Select } from '@chakra-ui/react'

// Setup Monaco Editor
// Attach YJS Text to Monaco Editor

function CodeEditor() {

  const editorRef = useRef(null);
  const [lang, setLang] = useState("javascript");

  // Editor value -> YJS Text value (A text value shared by multiple people)
  // One person deletes text -> Deletes from the overall shared text value
  // Handled by YJS

  // Initialize YJS, tell it to listen to our Monaco instance for changes.

function handleEditorDidMount(editor:any, monaco: any) {
  editorRef.current = editor;
  // Initialize YJS
  const doc = new Y.Doc(); // a collection of shared objects -> Text
  // Connect to peers (or start connection) with WebRTC
  const provider = new WebrtcProvider("test-room", doc); // room1, room2
  const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
  // Bind YJS to Monaco 
  //@ts-ignore
  const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
  console.log(provider.awareness);                
}

function handleEditorWillMount(monaco : any) {
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: function(model : any, position : any) {
        var word = model.getWordUntilPosition(position);
        var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        };
        return {
            suggestions: createDependencyProposals(range)
        };
    }
});
}

function createDependencyProposals(range: any) {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup
  return [
      {
          label: 'check',
          insertText: 'test',
          range: range
      },
  ];
}

  function submitCode() {
    //@ts-ignore
    const data= editorRef.current.getValue()
    alert(data)
    
  }

  function changeLang() {
    setLang("python")
  }

  return (
    <div>
      <Editor
      height="50vh"
      width="50vw"
      theme="vs-dark"
      language ={lang}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}/>
      <Select placeholder='Select option'>
        <option value='C#'>Option 1</option>
        <option value='C++'>Option 2</option>
        <option value='Python'>Option 3</option>
        <option value='Java'>Option 3</option>
      </Select>
      <button onClick={changeLang}>Change language!</button>
      <button onClick={submitCode}>Submit!</button>
    </div>
    
  )
}

export default CodeEditor