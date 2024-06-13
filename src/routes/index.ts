import { Router } from 'express'
import z from 'zod'
import 'dotenv/config'

import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { countTokens } from '@src/common/countTokens'

const apiRouter = Router()

apiRouter.get('/', async (req, res) => {
    // Load the PDF document - bema with 83 pages
    const bema = new PDFLoader('documents/KZBV_BEMA-2023-07-01.pdf')
    const pdfDocuments = await bema.load()

    // split the document into smaller snippets
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    })
    const snippets = await splitter.createDocuments(pdfDocuments.map((page) => page.pageContent))

    // Create a vector store
    const vectorStore = new MemoryVectorStore(
        new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
        })
    )

    // add snippets to the vector store
    await vectorStore.addDocuments(snippets)

    const results = await vectorStore.similaritySearch('Röntgendiagnostik', 5)

    res.status(200).json({
        results,
    })
})

apiRouter.get('/costs', async (req, res) => {
    // Load document - 83 pages
    const bema = new PDFLoader('documents/KZBV_BEMA-2023-07-01.pdf', {
        splitPages: false,
        parsedItemSeparator: '',
    })
    const pdf = await bema.load()
    const tokens = pdf.map((page) => countTokens(page.pageContent))
    const sum = tokens.reduce((a, b) => a + b, 0)
    res.status(200).json({
        pages: pdf.length,
        tokens: sum,
        costs: (sum * 0.13) / 1000000,
    })
})

const treatmentSchema = z.object({
    title: z.string({ description: 'Name of the treatment' }),
    treatmentNumber: z.string({ description: 'Number or id of the treatment' }),
    description: z.string({ description: 'Description of the treatment' }).optional().nullable(),
    combinableTreatmentNumbers: z
        .string({
            description: 'Treatment number or ids of the potential combineable treatments',
        })
        .array(),
    nonCombinableTreatmentNumbers: z
        .string({
            description: 'Treatment number or ids of the non-combineable treatments',
        })
        .array(),
})

const responseSchema = z.array(treatmentSchema)

//const initialParser = StructuredOutputParser.fromZodSchema(responseSchema);

export default apiRouter
