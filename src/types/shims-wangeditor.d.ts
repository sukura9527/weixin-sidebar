declare module '@wangeditor/editor-for-vue' {
    import { Component } from 'vue';

    export interface ToolbarProps {
        editor: any;
        defaultConfig: Record<string, any>;
        mode?: string;
    }

    export interface EditorProps {
        modelValue: string;
        defaultConfig: Record<string, any>;
        mode?: string;
        onCreated?: (editor: any) => void;
        onChange?: (editor: any) => void;
        onBlur?: (editor: any) => void;
        onFocus?: (editor: any) => void;
    }

    export const Toolbar: Component<ToolbarProps>;
    export const Editor: Component<EditorProps>;
}