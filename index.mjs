// NYC Restaurant Recommendation AI
// Takes user inputs along a few dimensions and outputs a list of recommended restaurants

// Dependencies
import { OpenAI } from 'openai';
import inquirer from 'inquirer';

// Initialize OpenAI with API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to get restaurant recommendations
async function getRestaurantRecommendations(answers) {
  const prompt = `Given the details below, recommend three restaurants based on the following user-supplied criteria:
    Location: ${answers.location}, Cuisine: ${answers.foodType}, Occasion: ${answers.occasion}, Budget: ${answers.budget}, Additional Considerations: ${answers.additionalConsiderations}.

    For each restaurant, provide the name, the location (street address and neighborhood), and a detailed explanation of why the restaurant is a good fit given the user input.
    The tone should be fun and witty, like your knowledgeable and somewhat sarcastic best friend wrote it. If you don't know the answer, please say so, instead of making something up.

    Please format the recommendations as follows:

    Restaurant 1:
    Name:
    Location:
    Explanation:

    Restaurant 2:
    Name:
    Location:
    Explanation:

    Restaurant 3:
    Name:
    Location:
    Explanation:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{
        role: "system",
        content: prompt,
      }],
      temperature: parseFloat(answers.temperature),
      max_tokens: 1000,
    });

    console.log("Let's see what's cooking:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error in getting recommendations:", error);
  }
}

// Function to collect user inputs
function collectUserInputs() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'location',
      message: 'Are you looking in any particular location or neighborhood? (Press Enter to skip)',
    },
    {
      type: 'input',
      name: 'foodType',
      message: 'What kind of food do you want? (Press Enter to skip)',
    },
    {
      type: 'input',
      name: 'occasion',
      message: "What's the occasion? (Press Enter to skip)",
    },
    {
      type: 'input',
      name: 'budget',
      message: "What's your budget? (Press Enter to skip)",
    },
    {
      type: 'input',
      name: 'additionalConsiderations',
      message: "Anything else I should consider? (Press Enter to skip)",
    },
    {
      type: 'input',
      name: 'temperature',
      message: "How creative do you want me to get (from 0.0 for reliable/predictable to 1.0 for creative/funky)?",
      validate: value => {
        const valid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 1;
        return valid || "Please enter a number between 0.0 and 1.0";
      },
      filter: Number,
    },
  ]).then((answers) => {
    console.log("Here are your preferences:");
    console.log(JSON.stringify(answers, null, 2)); // Displays user input

    getRestaurantRecommendations(answers); // Calls the function to get recommendations
  });
}

// Start the script by collecting user inputs
console.log("Welcome to the NYC Restaurant Recommendation AI! Let me know what you're in the mood for and I'll generate some tasty thoughts");
collectUserInputs();

