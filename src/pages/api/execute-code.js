import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { language, code, inputs } = req.body;

      const languageToFaas = {
        'c': 'c-runner',
        'cpp': 'cpp-runner',
        'java': 'java-runner',
        'python': 'python3-runner',
        'javascript': 'js-runner'
      };

      const faasFunction = languageToFaas[language.toLowerCase()];
      if (!faasFunction) {
        throw new Error('Unsupported language');
      }

      const response = await axios.post(
        `https://interpreter.hysterchat.com/function/${faasFunction}`,
        {
          code,
          inputs,
          requestId: Date.now().toString()
        },
        {
          headers: { 
            'Content-Type': 'application/json',
          }
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
