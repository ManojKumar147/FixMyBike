import axios from 'axios';

const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const API_KEY =
  'FXOh-saQKZQMylPR81uamnzpK0eiRja8RQTEAWW3hLdsjSMhlWC3GJzuQzKyAfd3P7ajYta7J3T3BlbkFJxlyYycoOyZ984JGgPc98EyLXam0YnYBvE-kfoBKWx2mkncHoU7GqOXCBSgFNX1TxreDG6wQUoA';

export const getChatBotResponse = async (userInput, retries = 3) => {
  const prompt = `You are a helpful assistant for the Fix My Bike app. 
You provide information and support regarding bike repair services, scheduling maintenance, pricing, and other related inquiries. 
If a user asks about services, provide details about what can be repaired or maintained.
If a user asks about prices, give general information on pricing or suggest contacting customer support for more details.
If a user has specific queries, do your best to provide accurate and helpful responses. 
Always respond in a friendly and supportive manner.`;

  try {
    const response = await axios.post(
      apiEndpoint,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: prompt},
          {role: 'user', content: userInput},
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.warn('Rate limit exceeded. Retrying...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
      return getChatBotResponse(userInput, retries - 1); // Retry
    }
    console.error('Error fetching the chatbot response:', error);
    return 'Sorry, I cannot provide an answer at the moment.';
  }
};
