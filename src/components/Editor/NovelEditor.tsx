import React from "react";

type Props = {
  title: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

function NovelEditor({ setContent, title }: Props) {
  return (
    <div>
      NovelEditor
      <button onClick={() => setContent("")}>{title}</button>
    </div>
  );
}

export default NovelEditor;

// import React from "react";
// import { Editor } from "novel";
// import { type Editor as TipTapEditor } from "@tiptap/core";
// import { Card, CardContent } from "../ui/card";

// type NovelEditorProps = {
//   setContent: any;
//   title: string;
// };
// export default function NovelEditor({
//   setContent,

//   title,
// }: NovelEditorProps) {
//   return (
//     <Card className="">
//       <CardContent>
//         <h2 className="pt-4 pb-3">{title}</h2>
//         <Editor
//           defaultValue={{
//             type: "doc",
//             content: [],
//             // content: content as JSONContent[] | undefined,
//           }}
//           onDebouncedUpdate={(editor?: TipTapEditor) => {
//             setContent(editor?.getHTML());
//           }}
//           disableLocalStorage={true}
//           className="rounded-xs border shadow-none text-white"
//         />
//       </CardContent>
//     </Card>
//   );
// }
