const axios = require('axios');
const UserRepository = require('../data/database/UserRepository');
const userRepository = new UserRepository();

exports.getNews = async (req, res) => {
  try {
    const { userId } = req.session;
    const userInterests = await userRepository.getUserInterests(userId);

    console.log(userInterests);

    // Ensure userInterests is an array and has items
    const interestsArray =
      Array.isArray(userInterests) && userInterests.length > 0
        ? userInterests.map((item) => item.Interests?.term)
        : [];

    if (interestsArray.length === 0) {
      return res
        .status(404)
        .json({ message: 'User has no interests to query.' });
    }

    const newsApiQuery = interestsArray.join(' OR ');

    console.log('News API Query:', newsApiQuery);

    // Make a request to the News API with user interests
    const newsApiResponse = await axios.get(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          apiKey: '66361ef8e1b34e79a4584e223f9b3a47',
          q: newsApiQuery, // Use user interests in the query
        },
      },
    );

    console.log('News API Response:', newsApiResponse.data);

    // Extract relevant data from the News API response
    const totalResults = newsApiResponse.data.totalResults || 0;

    if (totalResults === 0) {
      return res.status(404).json({
        message: 'No news articles found for the specified interests.',
      });
    }

    // Map the relevant data for each article
    const articles = newsApiResponse.data.articles || [];
    const mappedArticles = articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      author: article.author,
      publishedAt: article.publishedAt,
    }));

    // Send the news as the API response
    res.json({ news: mappedArticles });
  } catch (error) {
    console.error('Error fetching news:', error);

    // Log the error details
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getNewsByTopic = async (req, res) => {
  const topic = req.params.topic;
  const NEWS_API_KEY = '66361ef8e1b34e79a4584e223f9b3a47';

  try {
    // Make a request to the News API
    const newsApiResponse = await axios.get(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          apiKey: NEWS_API_KEY,
          q: topic,
        },
      },
    );

    // Extract relevant data from the News API response
    const articles = newsApiResponse.data.articles || [];

    // Map the relevant data for each article
    const mappedArticles = articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      author: article.author,
      publishedAt: article.publishedAt,
    }));

    // Check if there are no articles found
    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: 'No news found for the given topic.' });
    }

    // Send the news as the API response
    res.json({ news: mappedArticles });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
