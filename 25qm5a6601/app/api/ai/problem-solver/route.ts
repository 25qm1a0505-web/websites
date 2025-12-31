import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problem, step, userAnswer, hintsUsed } = body

    // In a real implementation, this would call OpenAI API
    // For now, we'll simulate AI responses based on the problem content

    const problemLower = problem.toLowerCase()
    let response

    if (step === 'concept-detection') {
      // Detect concepts
      const concepts = []
      if (problemLower.includes('hardness') || problemLower.includes('ca') || problemLower.includes('mg')) {
        concepts.push('Hardness')
      }
      if (problemLower.includes('ph') || problemLower.includes('hydrogen')) {
        concepts.push('pH')
      }
      if (problemLower.includes('mole') || problemLower.includes('molar')) {
        concepts.push('Stoichiometry')
      }
      if (problemLower.includes('concentration') || problemLower.includes('molarity')) {
        concepts.push('Concentration')
      }
      if (problemLower.includes('water')) {
        concepts.push('Water chemistry')
      }

      response = {
        concepts: concepts.length > 0 ? concepts : ['General Chemistry'],
        message: `I've identified the core concepts: ${concepts.join(', ')}. Let's start step-by-step!`,
      }
    } else if (step === 'concept-question') {
      // Generate concept question
      let question = 'What are the key principles involved in solving this type of problem?'
      if (problemLower.includes('hardness')) {
        question = 'What is the difference between temporary and permanent hardness of water?'
      } else if (problemLower.includes('ph')) {
        question = 'What does pH measure, and what is the pH scale range?'
      } else if (problemLower.includes('mole') || problemLower.includes('stoichiometry')) {
        question = 'What is the relationship between moles, mass, and molecular weight?'
      }

      response = {
        question,
      }
    } else if (step === 'hint') {
      // Generate progressive hints
      const hints = [
        'Think about the units involved. What are you trying to find?',
        'Consider the relationships between the given quantities.',
        'Check if you need to convert units before calculation.',
        'Review the formula that connects these concepts.',
        'Double-check your arithmetic and significant figures.',
      ]
      const hintIndex = Math.min(hintsUsed, hints.length - 1)
      response = {
        hint: hints[hintIndex],
      }
    } else if (step === 'answer-check') {
      // Check answer (simplified - in real app, use AI to evaluate)
      // This is a placeholder - real implementation would use OpenAI to evaluate
      const isCorrect = Math.random() > 0.3 // Simulated
      response = {
        correct: isCorrect,
        feedback: isCorrect
          ? "Great job! Your answer is correct. You've shown good understanding of the concepts."
          : "Your answer needs some work. Let's review: Check your units, verify your calculations, and ensure you've applied the correct formula.",
        suggestions: isCorrect
          ? []
          : [
              'Verify your units match the question requirements',
              'Check if you converted all values to consistent units',
              'Review the formula you used',
              'Ensure significant figures are correct',
            ],
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Problem Solver Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

