import React, { useState } from 'react'
import './Ide.css'
import axios from 'axios'
import baseUrl from '../../shared/baseUrl'
import MonacoEditor from 'react-monaco-editor';
import { code } from './defaultCode'

export default function Ide() {

    const [editor, setEditor] = useState({
        code: code.cpp,
        result: 'Submit Code to See Result',
        lang: 'cpp'
    })

    const onSubmitHandler = (e) => {
        e.preventDefault()
        alert("submit code")
        axios.post(`${baseUrl.url}code/submit`, editor)
            .then(res => {
                console.log(res.data)
                const data = res.data
                if (data.err) {
                    // Error in user code
                    setEditor((prevValue) => {
                        return {
                            ...prevValue,
                            result: data.error
                        }
                    })
                } else {
                    setEditor((prevValue) => {
                        return {
                            ...prevValue,
                            result: data.output
                        }
                    })
                }

            })
            .catch(err => {
                console.log(err)
            })
    }


    const onCodeChangeHandler = (newCode, e) => {
        console.log(e)
        setEditor((prevValue) => {
            return {
                ...prevValue,
                code: newCode
            }
        })
    }

    const onInputChangeHandler = (e) => {
        setEditor((prevValue) => {
            return {
                ...prevValue,
                input: e.target.value      
            }
        })
    }

    const editorDidMount = (e) => {
        console.log("EDITOR MOUNTED")
    }


    const onLangSelectHandler = (e) => {
        const lang = e.target.value
        setEditor((prevValue) => {
            return {
                ...prevValue,
                code: code[lang],
                lang: lang
            }
        })
    }


    const options = {
        selectOnLineNumbers: true,
        renderIndentGuides: true,
        colorDecorators: true,
        cursorBlinking: "blink",
        autoClosingQuotes: "always",
        find: {
            autoFindInSelection: "always"
        },
        snippetSuggestions: "inline"
    };

    console.log(editor)
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-10  mt-5">
                        <select className="p-2 col-12" id="lang" onChange={(e) => onLangSelectHandler(e)}>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>
                        <p className="mt-5 mb-2 lead d-block my-0" style={{fontSize: "35px", fontWeight: 400}}>Write your code here</p>
                        <div  type="text" id="code">
                            <MonacoEditor
                                width="100%"
                                height="600"
                                language={editor.lang}
                                theme="vs-dark"
                                value={editor.code}
                                options={options}
                                onChange={onCodeChangeHandler}
                                editorDidMount={editorDidMount}
                            />
                        </div>
                    </div>
                    <div className="col-10 mt-5">
                        <h3 style={{fontSize: "30px"}} className="lead d-block my-3">Provide Your Input</h3>
                        <textarea type="text" style={{width: "100%"}} id="input" rows={6} value={editor.input} onChange={onInputChangeHandler}>
                        </textarea>
                    </div>
                </div>
                <button className="btn btn-success mt-3" onClick={onSubmitHandler}>Submit Code</button>
                <div className="row">
                    <div className="col-10 my-5">
                        <textarea type="text" style={{width: "100%"}} id="result" cols={20} rows={6} className="p-3" value={editor.result} disabled={true}>
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}
