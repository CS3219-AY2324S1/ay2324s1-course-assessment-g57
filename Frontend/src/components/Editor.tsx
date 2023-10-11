import { useState, useRef } from 'react'
import Editor from "@monaco-editor/react"
import * as Y from "yjs"
import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from "../lib/y-monaco"
import {Container, Select, Button, Box} from "@chakra-ui/react"

// Setup Monaco Editor
// Attach YJS Text to Monaco Editor

function CodeEditor() {

  const editorRef = useRef(null);
  const [lang, setLang] = useState("python");
  const [loading, setLoading] = useState(false);

  // Editor value -> YJS Text value (A text value shared by multiple people)
  // One person deletes text -> Deletes from the overall shared text value
  // Handled by YJS

  // Initialize YJS, tell it to listen to our Monaco instance for changes.
function handleEditorDidMount(editor:any, monaco: any) {
  editorRef.current = editor;
  // Initialize YJS
  const doc = new Y.Doc(); // a collection of shared objects -> Text
  /* Connect to peers (or start connection) with WebRTC
  // have to generate a unique sessionID during matching so that matched
  users can have a shared room to code
  */
  const provider = new WebrtcProvider("test-room", doc); // room1, room2
  const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
  // Bind YJS to Monaco 
  //@ts-ignore
  const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
  console.log(provider.awareness);                
}

function submitCode() {
  //@ts-ignore
  const data= editorRef.current.getValue()
  alert(data)
  setLoading(true)
}

function changeLang(lang:any) {
  setLang(lang)
}

/*will have to modify this function to identify what
is the default language specified by the user and
add selected property to the other options
*/
function isSelected() {
  return true;
}

return (
  <div>
    <Container mb={16} style={{ position: 'relative', height: '50vh' }}>
      <div style={{ float:'right', paddingRight:3}}>
        <Select placeholder='Select Language' size={'md'} onChange={(e : React.ChangeEvent<HTMLSelectElement>) => {changeLang(e.target.value)}}>
          <option value='csharp'>C#</option> 
          <option value='cpp'>C++</option>
          <option value='python' selected = {isSelected()}>Python</option>
          <option value='go'>Go</option>
          <option value='java'>Java</option>
          <option value='kotlin'>Kotlin</option>
        </Select>
      </div>
    <Editor
      height="50vh"
      width="100vw"
      theme="vs-dark"
      language ={lang}
      onMount={handleEditorDidMount}/>
      <div style={{ float:'right', paddingRight:5}}>
        <Button
          isLoading={loading}
          onClick={submitCode}
          loadingText='Submitting'
          colorScheme='teal'
          variant='outline'>
          Submit Code
        </Button>
      </div>
      
    </Container>
  </div>
  )
}

export default CodeEditor

/*
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
*/