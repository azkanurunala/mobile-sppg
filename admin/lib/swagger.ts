
export const getApiDocs = async () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Mobile SPPG API',
      version: '1.0.0',
      description: 'API documentation for Mobile SPPG application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/mobile',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'KORWIL', 'ADMIN'] },
            location: { type: 'string', description: 'Assigned region for KORWIL' },
            nik: { type: 'string', description: 'KTP Number' },
          },
        },
        SPPG: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            code: { type: 'string' },
            status: { type: 'string' },
            preparationProgress: { type: 'number' },
            investor: { type: 'string' },
            location: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'phoneNumber', 'password'],
                  properties: {
                    name: { type: 'string' },
                    phoneNumber: { type: 'string' },
                    password: { type: 'string' },
                    email: { type: 'string' },
                    nik: { type: 'string', description: 'Required for KORWIL role' },
                    role: { type: 'string', enum: ['USER', 'KORWIL'] },
                    provinceId: { type: 'string' },
                    regencyId: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Missing required fields' },
            409: { description: 'User already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['phoneNumber', 'password'],
                  properties: {
                    phoneNumber: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                      refreshToken: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          summary: 'Refresh access token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'New tokens issued',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                      refreshToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid or expired refresh token' },
          },
        },
      },
      '/auth/logout': {
        post: {
          summary: 'Logout user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Logged out successfully' },
          },
        },
      },
      '/user/me': {
        get: {
          summary: 'Get current user profile',
          tags: ['User'],
          responses: {
            200: {
              description: 'User profile',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      '/user/profile': {
        put: {
          summary: 'Update user profile',
          tags: ['User'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    phoneNumber: { type: 'string' },
                    email: { type: 'string' },
                    regencyId: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profile updated' },
          },
        },
      },
      '/user/change-password': {
        post: {
          summary: 'Change password',
          tags: ['User'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Password changed' },
            401: { description: 'Invalid current password' },
          },
        },
      },
      '/wilayah/provinces': {
        get: {
          summary: 'List provinces',
          tags: ['Wilayah'],
          responses: {
            200: {
              description: 'List of provinces',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/wilayah/regencies': {
        get: {
          summary: 'List regencies',
          tags: ['Wilayah'],
          parameters: [
            {
              name: 'provinceId',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filter by province ID',
            },
          ],
          responses: {
            200: {
              description: 'List of regencies',
            },
          },
        },
      },
      '/dashboard/stats': {
        get: {
          summary: 'Get dashboard statistics',
          tags: ['Dashboard'],
          responses: {
            200: {
              description: 'Dashboard statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalSPPG: { type: 'number' },
                      averageProgress: { type: 'number' },
                      breakdown: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/sppg': {
        get: {
          summary: 'List SPPGs',
          tags: ['SPPG'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Paginated list of SPPGs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/SPPG' } },
                      pagination: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/sppg/{id}': {
        get: {
          summary: 'Get SPPG details',
          tags: ['SPPG'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'SPPG Details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SPPG' },
                },
              },
            },
          },
        },
      },
      '/sppg/{id}/checklist': {
        get: {
          summary: 'Get SPPG Checklist',
          tags: ['SPPG'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Checklist items',
            },
          },
        },
        post: {
          summary: 'Update SPPG Checklist',
          tags: ['SPPG'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          masterItemId: { type: 'string' },
                          isCompleted: { type: 'boolean', nullable: true, description: 'True for Yes, False for No, Null to reset' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Checklist updated' },
          },
        },
      },
      '/sppg/{id}/investor': {
        get: {
          summary: 'Get SPPG Investor',
          tags: ['SPPG'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Investor details',
            },
          },
        },
      },
    },
  };
};
