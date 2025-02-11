<script setup>

    import { useAppStore } from '../stores/appStore';
    const app = useAppStore()  // Pinia store

    const { plan } = defineProps({
        plan: Object
    })


    import Panel from 'primevue/panel';
    import Accordion from 'primevue/accordion';
    import AccordionPanel from 'primevue/accordionpanel';
    import AccordionHeader from 'primevue/accordionheader';
    import AccordionContent from 'primevue/accordioncontent';


</script>
<template>

    <Panel
        v-if="plan.rotate !== 0 || plan.skipping || plan.isScaled || plan.notices"
        style="background: #eee;"
        class="w-full"
    >
        <template #header>
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">info</span>
                <span class="font-bold">Tile Plan</span>
            </div>
        </template>
        <Accordion
            class="w-full"
            multiple
        >
            <AccordionPanel
                value="0"
                v-if="plan.rotate !== 0"
            >
                <AccordionHeader>
                    <div class="flex items-center gap-1 cursor-default">
                        <span class="material-symbols-outlined">rotate_90_degrees_cw</span>
                        <span> Rotating samples by</span>
                        <span> {{ plan.rotate }}°</span>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <p class="m-0 text-left	">
                        Sampled {{ app.samplingMode }} will be joined as {{ app.outputMode }}.
                    </p>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel
                value="1"
                v-if="plan.skipping"
            >
                <AccordionHeader>
                    <div class="flex items-center gap-1 cursor-default">
                        <span class="material-symbols-outlined">step_over</span>
                        <span>Skipping</span>
                        <span> {{ plan.skipping }} frames</span>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <p class="m-0 text-left">
                        {{ plan.length }} {{ app.tileProportion }} {{ plan.length == 1 ? 'tile' : 'tiles' }} at full
                        resolution
                        ({{ plan.width }}x{{ plan.height }}) {{ plan.length == 1 ? 'takes' : 'take' }} up {{
                            app.frameCount -
                            plan.skipping }} of {{
                            app.frameCount }}
                        possible sample {{ app.samplingMode }}. {{ plan.skipping }} {{ app.samplingMode }} from frames
                        {{ app.frameCount - plan.skipping + 1 }}-{{ app.frameCount }} do not form a full tile and will
                        be
                        skipped.
                    </p>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel
                value="2"
                v-if="plan.isScaled"
            >
                <AccordionHeader>
                    <div
                        v-if="(plan.scaleTo !== plan.scaleFrom)"
                        class="flex items-center gap-1 cursor-default"
                    >
                        <span
                            v-if="(plan.scaleTo < plan.scaleFrom)"
                            class="material-symbols-outlined"
                        >close_fullscreen</span>
                        <span v-if="(plan.scaleTo < plan.scaleFrom)">Scaling down from</span>
                        <span
                            v-if="(plan.scaleTo > plan.scaleFrom)"
                            class="material-symbols-outlined"
                        >open_in_full</span>
                        <span v-if="(plan.scaleTo > plan.scaleFrom)">Scaling up from</span>
                        <span> {{ plan.scaleFrom }}<span style="font-variant: small-caps;">px</span></span>

                        <span>to</span>
                        <span> {{ plan.scaleTo }}<span style="font-variant: small-caps;">px</span></span>

                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <p class="m-0 text-left">
                        {{ app.frameCount }} sampled {{ app.samplingMode }} are sufficient for {{ plan.length }} {{
                            plan.length ==
                                1 ? 'tile' : 'tiles' }} of {{ plan.scaleTo }}px. Downsampling from {{ plan.scaleFrom }}px to
                        retain
                        proportions.
                    </p>
                </AccordionContent>
            </AccordionPanel>

            <AccordionPanel
                value="3"
                v-if="plan.length == 0"
            >
                <AccordionHeader>
                    <div class="flex items-center gap-1 cursor-default">
                        <span class="material-symbols-outlined">warning</span>
                        <span>Insufficient frames</span>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <p class="m-0 text-left">
                        {{ app.frameCount }} sampled {{ app.samplingMode }} is not adequate to fill a tile.
                    </p>
                </AccordionContent>
            </AccordionPanel>

            <AccordionPanel
                value="4"
                v-if="plan.notices?.length > 0"
            >
                <AccordionHeader>
                    <div class="flex items-center gap-1 cursor-default">
                        <span class="material-symbols-outlined">warning</span>
                        <span>Notices</span>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <p
                        class="m-0 text-left"
                        v-for="notice in plan.notices"
                    >
                        {{ notice }}
                    </p>
                </AccordionContent>
            </AccordionPanel>

            <!-- if (plan.length == 0) {
                // if the calculated number of tiles is zero
                // we lack sufficient frames to fill the last tile
                plan.notices.push('Not enough frames to fill a tile')
            } -->


        </Accordion>
    </Panel>
</template>

<style scoped>
    .small-icon {
        font-size: 1.125rem;
    }
</style>