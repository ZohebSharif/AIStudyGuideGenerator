const { createClient } = require('@supabase/supabase-js');
const Groq = require("groq-sdk");

// --- Initialize Groq ---
const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



// --- Generate Study Guide from Groq ---
async function getGroqChatCompletion(userInput) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are a confident and authoritative AI study guide generator. When the user provides a topic, you will generate a detailed, comprehensive, and final study guide based on that topic.
    
    Your response should:
    1. Start with the topic in the format "<Topic> - Study Guide".
    2. Be structured and clear, with key concepts, definitions, examples, and useful tips.
    3. Include various sections like an overview, important points, and operations where applicable.
    4. Be final and complete—do not ask any questions or offer further elaboration. The guide should be thorough enough that no follow-up is needed.
    
    The response must be direct and to the point, with no disclaimers or further prompts.
    
    User's Topic: "${userInput}"`,
        },
      ],
      model: "llama3-8b-8192",
    });
    


    return chatCompletion;
  } catch (err) {

    throw err;
  }
}

// --- Save to Supabase ---
async function writeToSupabase(text) {
  try {


    const { data, error } = await supabase
    .from('studyguides')
    .insert([{ text: text }]);

    if (error) {
      return;
    }


  } catch (err) {

  }
}

// --- Main Exported Function ---
async function WriteDatabase(userInput) {
  try {
    const chatCompletion = await getGroqChatCompletion(userInput);
    const groqOutput = chatCompletion.choices?.[0]?.message?.content || "No response from Groq.";


    await writeToSupabase(groqOutput);
  } catch (err) {

  }
}

module.exports = WriteDatabase;