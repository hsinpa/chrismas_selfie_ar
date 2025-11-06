import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type ARCameraStoreState = {
    draw_gift: string | undefined,
    selfie_source: string | null,


    set_draw_gift: (gift: string) => void,
    set_selfie: (selfie_base64: string) => void,
}

export const useARCameraStore = create<ARCameraStoreState>()(
    immer((set, get) => ({
        draw_gift: undefined,
        selfie_source: null,

        set_draw_gift: (gift: string) => {
            set(state => {
                state.draw_gift = gift;
            });
    },
        set_selfie: (selfie_base64: string) => {
            set(state => {
                state.selfie_source = selfie_base64;
            });
    },
    })),
)
