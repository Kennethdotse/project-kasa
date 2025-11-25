'use server';

/**
 * @fileOverview A flow for transcribing audio recordings into text.
 *
 * - transcribeRecording - A function that handles the transcription process.
 * - TranscribeRecordingInput - The input type for the transcribeRecording function.
 * - TranscribeRecordingOutput - The return type for the transcribeRecording function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeRecordingInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
    ),
});
export type TranscribeRecordingInput = z.infer<typeof TranscribeRecordingInputSchema>;

const TranscribeRecordingOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio recording.'),
});
export type TranscribeRecordingOutput = z.infer<typeof TranscribeRecordingOutputSchema>;

export async function transcribeRecording(input: TranscribeRecordingInput): Promise<TranscribeRecordingOutput> {
  return transcribeRecordingFlow(input);
}

const transcribeRecordingPrompt = ai.definePrompt({
  name: 'transcribeRecordingPrompt',
  input: {schema: TranscribeRecordingInputSchema},
  output: {schema: TranscribeRecordingOutputSchema},
  prompt: `Transcribe the following audio recording to text:\n\n{{media url=audioDataUri}}`,
});

const transcribeRecordingFlow = ai.defineFlow(
  {
    name: 'transcribeRecordingFlow',
    inputSchema: TranscribeRecordingInputSchema,
    outputSchema: TranscribeRecordingOutputSchema,
  },
  async input => {
    const {output} = await transcribeRecordingPrompt(input);
    return output!;
  }
);
