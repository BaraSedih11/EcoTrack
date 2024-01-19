const axios = require('axios');
const ResourceRepository = require('../data/database/ResourceRepository');

const resourceRepository = new ResourceRepository();

exports.getAllResources = async (req, res) => {
  try {
    // Fetch resources from your database
    const resources = await resourceRepository.getAllResources();

    // Use external API to enhance resource data
    const enhancedResources = await Promise.all(
      resources.map(async (resource) => {
        try {
          // Use the external API (adjust the URL and parameters accordingly)
          const externalApiResponse = await axios.get(
            'https://books.googleapis.com/books/v1/volumes',
            {
              params: {
                q: resource.title,
              },
            },
          );

          // Extract relevant data from the external API response
          const enhancedData = {
            bookCover:
              externalApiResponse.data.items?.[0]?.volumeInfo?.imageLinks
                ?.thumbnail,
            author:
              externalApiResponse.data.items?.[0]?.volumeInfo?.authors?.[0],
            publicationDate:
              externalApiResponse.data.items?.[0]?.volumeInfo?.publishedDate,
            publisher:
              externalApiResponse.data.items?.[0]?.volumeInfo?.publisher,
            averageRating:
              externalApiResponse.data.items?.[0]?.volumeInfo?.averageRating,
            ratingsCount:
              externalApiResponse.data.items?.[0]?.volumeInfo?.ratingsCount,
            topics: externalApiResponse.data.items?.[0]?.volumeInfo?.categories,
            resourceType: externalApiResponse.data.items?.[0]?.volumeInfo?.type,
            relatedResources:
              externalApiResponse.data.items?.[0]?.volumeInfo?.relatedBooks,
            recommendedReadings:
              externalApiResponse.data.items?.[0]?.volumeInfo?.recommended,
            educationalLevel:
              externalApiResponse.data.items?.[0]?.volumeInfo?.educationalLevel,
          };

          // Combine the original resource data with the enhanced data
          return { ...resource, ...enhancedData };
        } catch (error) {
          // Handle errors from the external API request
          console.error('Error fetching data from external API:', error);
          return resource; // Return the original resource in case of API error
        }
      }),
    );

    res.json({ resources: enhancedResources });
  } catch (error) {
    console.error('Error fetching resources from the database:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getResourceById = async (req, res) => {
  const resourceId = req.params.resourceId;

  try {
    // Fetch resource details from your database
    const resource = await resourceRepository.getResourceById(resourceId);

    console.log(resource);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    // Use external API to enhance resource data
    const externalApiResponse = await axios.get(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: resource.title,
          key: 'AIzaSyDgmky3Y9Akhak0ZhjFrFSoKPyQ0N40diA', // Replace with your actual API key
        },
      },
    );

    // Log the entire response from the Google Books API
    console.log('External API response:', externalApiResponse.data);

    // Extract relevant data from the external API response
    const volumes = externalApiResponse.data.items || [];

    // Choose the first volume (you might want to add logic to choose the most relevant one)
    const selectedVolume = volumes[0];

    // Extract details from the selected volume
    const externalDetails = selectedVolume?.volumeInfo || {};

    const enhancedData = {
      externalDetails: {
        title: externalDetails.title || 'N/A',
        bookCover:
          externalApiResponse.data.items?.[0]?.volumeInfo?.imageLinks
            ?.thumbnail,
        author: externalApiResponse.data.items?.[0]?.volumeInfo?.authors?.[0],
        publicationDate:
          externalApiResponse.data.items?.[0]?.volumeInfo?.publishedDate,
        publisher: externalApiResponse.data.items?.[0]?.volumeInfo?.publisher,
        averageRating:
          externalApiResponse.data.items?.[0]?.volumeInfo?.averageRating,
        ratingsCount:
          externalApiResponse.data.items?.[0]?.volumeInfo?.ratingsCount,
        topics: externalApiResponse.data.items?.[0]?.volumeInfo?.categories,
        resourceType: externalApiResponse.data.items?.[0]?.volumeInfo?.type,
        relatedResources:
          externalApiResponse.data.items?.[0]?.volumeInfo?.relatedBooks,
        recommendedReadings:
          externalApiResponse.data.items?.[0]?.volumeInfo?.recommended,
        educationalLevel:
          externalApiResponse.data.items?.[0]?.volumeInfo?.educationalLevel,
        description: externalDetails.description || 'N/A',
        // Add other relevant data from the external API
      },
    };

    // Combine the original resource data with the enhanced data
    res.json({ ...resource, ...enhancedData });
  } catch (error) {
    console.error('Error fetching resource details:', error);

    // Log the error details
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.createResource = async (req, res) => {
  const { title, description, url, type, topic, author } = req.body;

  try {
    const newResource = await resourceRepository.createResource({
      title,
      description,
      url,
      type,
      topic,
      author,
    });

    res.status(201).json({ message: 'Resources added successfully.' });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(409).json({ message: 'This resource title already exists.' });
  }
};

exports.updateResource = async (req, res) => {
  const resourceId = req.params;
  const updatedFields = req.body;

  try {
    const updatedResource = await resourceRepository.updateResource(
      resourceId,
      updatedFields,
    );

    if (updatedResource) {
      res.status(200).json({ resource: updatedResource });
    } else {
      res.status(404).json({ message: 'Resource not found.' });
    }
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deleteResource = async (req, res) => {
  const resourceId = req.params;

  try {
    const deletedResource = await resourceRepository.deleteResource(resourceId);

    if (deletedResource) {
      res.status(200).json({ message: 'Resource deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Resource not found.' });
    }
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.filterResourcesByTopic = async (req, res) => {
  const topic = req.params;

  try {
    // Fetch resources from your database
    const results = await resourceRepository.filterResourcesByTopic(topic);

    // Use external API to enhance resource data
    const enhancedResults = await Promise.all(
      results.map(async (resource) => {
        try {
          // Use the external API (adjust the URL and parameters accordingly)
          const externalApiResponse = await axios.get(
            'https://books.googleapis.com/books/v1/volumes',
            {
              params: {
                q: resource.title,
                key: 'AIzaSyDgmky3Y9Akhak0ZhjFrFSoKPyQ0N40diA', // Replace with your actual API key
              },
            },
          );

          // Extract relevant data from the external API response
          const enhancedData = {
            bookCover:
              externalApiResponse.data.items?.[0]?.volumeInfo?.imageLinks
                ?.thumbnail,
            author: externalApiResponse.data.items?.[0]?.volumeInfo?.authors,
            description:
              externalApiResponse.data.items?.[0]?.volumeInfo?.description,
            publisher:
              externalApiResponse.data.items?.[0]?.volumeInfo?.publisher,

            // Add other relevant data from the external API
          };

          // Combine the original resource data with the enhanced data
          return { ...resource, ...enhancedData };
        } catch (error) {
          // Handle errors from the external API request
          console.error('Error fetching data from external API:', error);
          return resource; // Return the original resource in case of API error
        }
      }),
    );

    if (enhancedResults.length === 0) {
      res
        .status(404)
        .json({ message: 'No resources found for the given topic.' });
    } else {
      res.json({ resources: enhancedResults });
    }
  } catch (error) {
    console.error('Error filtering resources by topic:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.filterResourcesByType = async (req, res) => {
  const type = req.params;

  try {
    // Fetch resources from your database
    const results = await resourceRepository.filterResourcesByType(type);

    // Use external API to enhance resource data
    const enhancedResults = await Promise.all(
      results.map(async (resource) => {
        try {
          // Use the external API (adjust the URL and parameters accordingly)
          const externalApiResponse = await axios.get(
            'https://books.googleapis.com/books/v1/volumes',
            {
              params: {
                q: resource.title,
                key: 'AIzaSyDgmky3Y9Akhak0ZhjFrFSoKPyQ0N40diA', // Replace with your actual API key
              },
            },
          );

          // Extract relevant data from the external API response
          const enhancedData = {
            bookCover:
              externalApiResponse.data.items?.[0]?.volumeInfo?.imageLinks
                ?.thumbnail,
            author: externalApiResponse.data.items?.[0]?.volumeInfo?.authors,
            description:
              externalApiResponse.data.items?.[0]?.volumeInfo?.description,
            publisher:
              externalApiResponse.data.items?.[0]?.volumeInfo?.publisher,

            // Add other relevant data from the external API
          };

          // Combine the original resource data with the enhanced data
          return { ...resource, ...enhancedData };
        } catch (error) {
          // Handle errors from the external API request
          console.error('Error fetching data from external API:', error);
          return resource; // Return the original resource in case of API error
        }
      }),
    );

    if (enhancedResults.length === 0) {
      res
        .status(404)
        .json({ message: 'No resources found for the given type.' });
    } else {
      res.json({ resources: enhancedResults });
    }
  } catch (error) {
    console.error('Error filtering resources by type:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
