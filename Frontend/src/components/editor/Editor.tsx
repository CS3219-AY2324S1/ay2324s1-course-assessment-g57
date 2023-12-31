import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from '../../lib/y-monaco';
import { Box, Button, Select } from '@chakra-ui/react';
import { fromUint8Array } from 'js-base64';
import Link from 'next/link';

import * as random from 'lib0/random';

import { MdPlayArrow } from 'react-icons/md';
import socket from '@/lib/socket';

// Setup Monaco Editor
// Attach YJS Text to Monaco Editor

function CodeEditor({ roomId }: { roomId: string }) {
    const editorRef = useRef<any>(null);
    const [lang, setLang] = useState('python');
    const [loading, setLoading] = useState(false);
    const [editorTheme] = useState('light');
    const [editorOutput, setEditorOutput] = useState('');
    const [provider, setProvider] = useState(null);

    const usercolors = [
        { color: '#30bced', light: '#30bced33' },
        { color: '#6eeb83', light: '#6eeb8333' },
        { color: '#ffbc42', light: '#ffbc4233' },
        { color: '#ecd444', light: '#ecd44433' },
        { color: '#ee6352', light: '#ee635233' },
        { color: '#9ac2c9', light: '#9ac2c933' },
        { color: '#8acb88', light: '#8acb8833' },
        { color: '#1be7ff', light: '#1be7ff33' },
    ];

    // select a random color for this user
    const userColor = usercolors[random.uint32() % usercolors.length];

    // Editor value -> YJS Text value (A text value shared by multiple people)
    // One person deletes text -> Deletes from the overall shared text value
    // Handled by YJS

    // Initialize YJS, tell it to listen to our Monaco instance for changes.
    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
        // Initialize YJS
        const doc = new Y.Doc(); // a collection of shared objects -> Text
        /* Connect to peers (or start connection) with WebRTC
        have to generate a unique sessionID during matching so that matched
        users can have a shared room to code
        */

        const SIGNALING_SERVER =
            process.env.NEXT_PUBLIC_ENV == 'PROD'
                ? process.env.NEXT_PUBLIC_SIGNALING_SERVER_PROD
                : process.env.NEXT_PUBLIC_SIGNALING_SERVER_DEV;

        // Code to handle successful creation of the provider instance
        //@ts-ignore
        const newProvider = new WebrtcProvider(roomId, doc, {
            signaling: [SIGNALING_SERVER as string],
        });

        //provider awareness for each user
        //@ts-ignore
        newProvider.awareness.setLocalStateField('user', {
            name: 'Anonymous ' + Math.floor(Math.random() * 100),
            color: userColor.color,
            colorLight: userColor.light,
        });
        const type = doc.getText('monaco'); // doc { "monaco": "what our IDE is showing" }

        // Bind YJS to Monaco
        new MonacoBinding(
            type,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            //@ts-ignore
            newProvider.awareness
        );
        //@ts-ignore
        setProvider(newProvider);
    }

    function getLangID(inputLang: string): String {
        if (inputLang == 'python') {
            return '92';
        } else if (inputLang == 'cpp') {
            return '54';
        } else if (inputLang == 'csharp') {
            return '51';
        } else if (inputLang == 'kotlin') {
            return '78';
        } else if (inputLang == 'java') {
            return '91';
        } else {
            return '95';
        }
    }

    /*Save the code as a binary file*/
    async function submitCode() {
        console.log(lang);
        console.log(getLangID(lang));
        const data = editorRef.current?.getValue();
        // alert(data);
        setLoading(true);
        const enc = new TextEncoder();
        const documentState = enc.encode(data);
        // Transform Uint8Array to a Base64-String
        const base64Encoded = fromUint8Array(documentState);

        // alert(base64Encoded);
        // Transform Base64-String back to an Uint8Array
        // const binaryEncoded = toUint8Array(base64Encoded);
        // alert(binaryEncoded);
        //convert back to string
        //alert(dec.decode(binaryEncoded));

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
                base64_encoded: 'true',
                wait: 'true',
                fields: 'token',
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_X_RapidAPI_Key,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
            data: {
                language_id: getLangID(lang),
                source_code: base64Encoded,
            },
        };

        try {
            const response = await axios.request(options);
            console.log('POST: ' + response.data.token);
            const testUrl =
                'https://judge0-ce.p.rapidapi.com/submissions/' +
                response.data.token;
            console.log(testUrl);

            const options2 = {
                method: 'GET',
                url: testUrl,
                params: {
                    base64_encoded: 'false',
                    fields: '*',
                },
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_X_RapidAPI_Key,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            };

            try {
                const response2 = await axios.request(options2);
                console.log('GET:' + response2.data);
                const output =
                    'Output: ' +
                    response2.data.stdout +
                    '\n' +
                    'Error: ' +
                    response2.data.stderr +
                    '\n' +
                    'Compilation output: ' +
                    response2.data.compile_output;
                setLoading(false);
                setEditorOutput(output);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function changeLang(inputLang: any) {
        setLang(inputLang);
    }

    function disconnect() {
        socket.disconnect();
    }

    /*
    will have to modify this function to identify what
    is the default language specified by the user and
    add selected property to the other options
    */
    // function isSelected() {
    //     return true;
    // }

    // function setDarkMode() {
    //     editorTheme == 'light'
    //         ? setEditorTheme('vs-dark')
    //         : setEditorTheme('light');
    // }

    function destoryConn() {
        //@ts-ignore
        provider.destroy();
    }

    return (
        <>
            <div className="container">
                <Link
                    style={{ float: 'right' }}
                    onClick={() => {
                        destoryConn();
                        disconnect();
                    }}
                    className="button is-danger mb-2"
                    href="/dashboard"
                >
                    Leave Room
                </Link>
                {/* Code Editor */}
                <div>
                    <Box style={{ height: '45em', width: '100%' }}>
                        <Editor
                            className="editor"
                            theme={editorTheme}
                            language={lang}
                            onMount={handleEditorDidMount}
                            options={{ fontSize: 12, automaticLayout: true }}
                        />
                    </Box>
                    <br />
                    {/* Console Output */}
                    <div>
                        <textarea
                            className="textarea has-fixed-size"
                            placeholder="Console Output"
                            readOnly={true}
                            value={editorOutput}
                            style={{ width: '100%', height: '100px' }}
                        ></textarea>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: 2,
                        }}
                    >
                        {/* <IconButton
                        aria-label="Dark Mode"
                        variant="outline"
                        colorScheme="white"
                        fontSize="20px"
                        height={30}
                        icon={<MdOutlineDarkMode />}
                    />
                    <Switch
                        onChange={setDarkMode}
                        paddingLeft={2}
                        paddingRight={5}
                    /> */}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                            className="select is-link is-normal"
                            minWidth={100}
                            maxWidth={100}
                            placeholder="Select Language"
                            size={'md'}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                changeLang(e.target.value);
                            }}
                            defaultValue={'python'}
                        >
                            <option value="csharp">C#</option>
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                            <option value="go">Go</option>
                            <option value="java">Java</option>
                            <option value="kotlin">Kotlin</option>
                        </Select>

                        <Button
                            float={'right'}
                            isLoading={loading}
                            onClick={submitCode}
                            loadingText="Submitting"
                            colorScheme="teal"
                            variant="outline"
                            ml={4}
                            mr={2}
                            rightIcon={<MdPlayArrow />}
                        >
                            Run
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeEditor;

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
