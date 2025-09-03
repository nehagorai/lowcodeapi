/**
 *
 * CopyToClipboard
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import IconPack from '../IconPack';

function Clipbaord({ text, prompt, children, normal, active = false, onCopy}) {
  // const [copied, setClipboard] = useCopyToClipboard();
  const [copied, setClipboard] = useState("");
  const [lText, setText] = useState(text)

  const normalC = normal || 'text-gray-600 hover:text-blue-500'

  useEffect(() => {
    setText(text);
    setClipboard('');
  }, [text]);

  const copyToClipboard = async(text) => {
    setClipboard(text);
    if (navigator) {
      await navigator.clipboard.writeText(text);
    }
    onCopy(text);
  }
  return (
    <>
      <button onClick={() => copyToClipboard(lText)}
        className={`relative
          flex items-center
          ${copied && active
            ? `text-blue-500`
            : `cursor-pointer ${normalC}`
          }
        `}
      >
        <span title={copied ? `${lText}.\n\nCopied to clipboard `: 'Copy to clipboard'}>
          <IconPack name={copied ? 'clipboardCheck': 'clipboard'} />
        </span>
        {/* {copied ? <span className="absolute ml-5 text-xs">{prompt || "Copied" }</span> : null} */}
        {children}
      </button>
      
    </>
  );
}

Clipbaord.propTypes = {
  text: PropTypes.string,
};

export default Clipbaord;
