module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Online learning platform API',
    version: '1.0.0',
    description: 'API documentation for online learning platform',
  },
  paths: {
    // Authentication Routes
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        description: 'Creates a new user with a username, email, and password.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['student', 'instructor'] },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  profilePicture: { type: 'string' },
                  bio: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Validation error or user already exists' },
          '500': { description: 'Registration failed' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login a user',
        description: 'Logs in a user using username and password.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful, returns JWT' },
          '400': { description: 'Missing fields' },
          '401': { description: 'Invalid credentials' },
          '500': { description: 'Login failed' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current user info',
        description: "Returns the current authenticated user's username and role.",
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User info returned' },
          '404': { description: 'User not found' },
          '500': { description: 'Failed to fetch user info' },
        },
      },
    },
    '/auth/set-role': {
      post: {
        summary: 'Update user role',
        description: 'Updates the role for a user authenticated via Google OAuth.',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['student', 'instructor'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Role updated' },
          '400': { description: 'Invalid role' },
          '404': { description: 'User not found' },
          '500': { description: 'Failed to update role' },
        },
      },
    },
    '/auth/upload-image': {
      post: {
        summary: 'Upload an image',
        description: 'Uploads an image to Cloudinary and returns the URL.',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' },
                  folder: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Image uploaded successfully' },
          '400': { description: 'No file uploaded' },
          '500': { description: 'Image upload failed' },
        },
      },
    },

    // Chat Routes
    '/api/chat': {
      post: {
        summary: 'Chat with GPT',
        description: 'Send a message to ChatGPT and get a response',
        tags: ['Chat'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { 
                    type: 'string',
                    description: 'The message to send to ChatGPT',
                    example: 'Explain quantum computing in simple terms'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { 
            description: 'Successful response from ChatGPT',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'string',
                      description: 'The response from ChatGPT'
                    }
                  }
                }
              }
            }
          },
          '400': { 
            description: 'Message is required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Message is required'
                    }
                  }
                }
              }
            }
          },
          '500': { 
            description: 'Failed to get response from ChatGPT',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Failed to get response from ChatGPT'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

     // Course Routes
    '/api/courses': {
      post: {
        summary: 'Create a new course',
        description: 'Create a new course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  image: { type: 'string' },
                  price: { type: 'number' },
                  published: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Course created successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Failed to create course' }
        }
      },
      get: {
        summary: 'Get instructor courses',
        description: 'Get all courses for the current instructor',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { 
            description: 'Courses retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Course'
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Failed to fetch courses' }
        }
      }
    },
    '/api/courses/{id}': {
      get: {
        summary: 'Get course details',
        description: 'Get details for a specific course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { 
            description: 'Course details retrieved',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Course'
                }
              }
            }
          },
          '404': { description: 'Course not found' },
          '500': { description: 'Failed to fetch course details' }
        }
      },
      put: {
        summary: 'Update course',
        description: 'Update course details (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  image: { type: 'string' },
                  price: { type: 'number' },
                  published: { type: 'boolean' },
                  lessons: { type: 'array' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Course updated successfully' },
          '404': { description: 'Course not found or not authorized' },
          '500': { description: 'Failed to update course' }
        }
      },
      delete: {
        summary: 'Delete course',
        description: 'Delete a course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Course deleted successfully' },
          '404': { description: 'Course not found or not authorized' },
          '500': { description: 'Failed to delete course' }
        }
      }
    },
    '/api/courses/{id}/students': {
      get: {
        summary: 'Get enrolled students',
        description: 'Get students enrolled in a course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { 
            description: 'Students retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          },
          '404': { description: 'Course not found' },
          '500': { description: 'Failed to fetch students' }
        }
      }
    },
    '/api/courses/{courseId}/sections': {
      post: {
        summary: 'Add section to course',
        description: 'Add a new section to a course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Section added successfully' },
          '404': { description: 'Course not found' },
          '500': { description: 'Failed to add section' }
        }
      }
    },
    '/api/courses/{courseId}/sections/{sectionId}': {
      put: {
        summary: 'Update section',
        description: 'Update a section in a course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'sectionId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Section updated successfully' },
          '404': { description: 'Course or section not found' },
          '500': { description: 'Failed to update section' }
        }
      },
      delete: {
        summary: 'Remove section',
        description: 'Remove a section from a course (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'sectionId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Section removed successfully' },
          '404': { description: 'Course or section not found' },
          '500': { description: 'Failed to remove section' }
        }
      }
    },
    '/api/courses/{courseId}/sections/{sectionId}/topics': {
      post: {
        summary: 'Add topic to section',
        description: 'Add a new topic to a section (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'sectionId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  videoUrl: { type: 'string' },
                  resources: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Topic added successfully' },
          '404': { description: 'Course or section not found' },
          '500': { description: 'Failed to add topic' }
        }
      }
    },
    '/api/courses/{courseId}/sections/{sectionId}/topics/{topicId}': {
      put: {
        summary: 'Update topic',
        description: 'Update a topic in a section (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'sectionId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'topicId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  videoUrl: { type: 'string' },
                  resources: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Topic updated successfully' },
          '404': { description: 'Course, section or topic not found' },
          '500': { description: 'Failed to update topic' }
        }
      },
      delete: {
        summary: 'Remove topic',
        description: 'Remove a topic from a section (instructor only)',
        tags: ['Courses'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'sectionId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'topicId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Topic removed successfully' },
          '404': { description: 'Course, section or topic not found' },
          '500': { description: 'Failed to remove topic' }
        }
      }
    },
        // Student Routes
    '/api/student/courses': {
      get: {
        summary: 'Get all available courses',
        description: 'Get all published courses available for enrollment (student only)',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { 
            description: 'Courses retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Course'
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Failed to fetch courses' }
        }
      }
    },
    '/api/student/courses/{id}': {
      get: {
        summary: 'Get course details',
        description: 'Get details for a specific course (student only)',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { 
            description: 'Course details retrieved',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Course'
                }
              }
            }
          },
          '404': { description: 'Course not found' },
          '500': { description: 'Failed to fetch course details' }
        }
      }
    },
    '/api/student/courses/{id}/enroll': {
      post: {
        summary: 'Enroll in course',
        description: 'Enroll the current student in a course (student only)',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Enrolled successfully' },
          '400': { description: 'Already enrolled' },
          '404': { description: 'Course not found' },
          '500': { description: 'Failed to enroll' }
        }
      }
    },
    '/api/student/enrolled': {
      get: {
        summary: 'Get enrolled courses',
        description: 'Get all courses the current student is enrolled in (student only)',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { 
            description: 'Enrolled courses retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Course'
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Failed to fetch enrolled courses' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Course: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          instructor: { $ref: '#/components/schemas/User' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          image: { type: 'string' },
          price: { type: 'number' },
          published: { type: 'boolean' },
          students: { type: 'array', items: { $ref: '#/components/schemas/User' } },
          sections: { type: 'array', items: { $ref: '#/components/schemas/Section' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['student', 'instructor'] },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          profilePicture: { type: 'string' }
        }
      },
      Section: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          topics: { type: 'array', items: { $ref: '#/components/schemas/Topic' } }
        }
      },
      Topic: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          videoUrl: { type: 'string' },
          resources: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication related endpoints'
    },
    {
      name: 'Chat',
      description: 'Chat with AI endpoints'
    },
    {
      name: 'Courses',
      description: 'Course management endpoints (instructor only)'
    },
    {
      name: 'Student',
      description: 'Student-specific endpoints'
    }
  ]
};