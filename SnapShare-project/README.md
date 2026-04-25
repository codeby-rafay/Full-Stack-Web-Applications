# SnapShare

A full-stack social media application that allows users to create, view, edit, and delete photo posts with captions. Built with modern web technologies for a seamless user experience.

## Features

- **Create Posts**: Upload images with captions to share with the community
- **View Feed**: Browse all posts in a centralized feed
- **Edit Captions**: Update post captions after creation
- **Delete Posts**: Remove your posts from the feed
- **Image Storage**: Cloud-based image storage using ImageKit
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Real-time Updates**: Instant post updates across the application

## Tech Stack

### Frontend

- **React** - UI library for building interactive components
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API requests
- **React Router DOM** - Client-side routing

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for building REST APIs
- **MongoDB** - NoSQL database for storing posts
- **Mongoose** - MongoDB object modeling
- **Multer** - Middleware for handling file uploads
- **ImageKit** - Cloud-based image storage and optimization
- **CORS** - Cross-Origin Resource Sharing middleware

## Prerequisites

Before running the project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB running locally or a MongoDB Atlas connection
- ImageKit account with API credentials

## Getting Started

### Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3000
```

4. Start the backend server:

```bash
npm start
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will open on `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
SnapShare-project/
├── Backend/
│   ├── server.js              # Entry point for backend
│   ├── package.json           # Backend dependencies
│   └── src/
│       ├── app.js             # Express app configuration
│       ├── db/
│       │   └── db.js          # MongoDB connection
│       ├── models/
│       │   └── post.model.js  # Post schema and model
│       └── services/
│           └── storage.service.js # ImageKit upload service
└── Frontend/
    ├── package.json           # Frontend dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind CSS configuration
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Main App component
        ├── components/
        │   └── Navbar.jsx     # Navigation component
        └── pages/
            ├── CreatePost.jsx # Create post page
            ├── Feed.jsx       # Feed page
            └── UpdateCaption.jsx # Update caption page
```

## API Endpoints

### Posts

#### Create Post

- **POST** `/post-create`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `image`: Image file
  - `caption`: Post caption text
- **Response**: Created post object

#### Get All Posts

- **GET** `/posts`
- **Response**: Array of all posts

#### Delete Post

- **DELETE** `/posts/:id`
- **Params**: `id` - Post ID
- **Response**: Success message

#### Update Post Caption

- **PATCH** `/posts/:id`
- **Params**: `id` - Post ID
- **Body**: `caption` - New caption text
- **Response**: Updated post object

## Usage

### Creating a Post

1. Click on "Create Post" button in the navigation
2. Select an image from your device
3. Add a caption for your image
4. Click "Post" to share

### Viewing Feed

1. Navigate to the "Feed" section
2. View all posts from all users
3. Posts are displayed with images and captions

### Editing a Post

1. Click the edit button on a post
2. Update the caption
3. Save the changes

### Deleting a Post

1. Click the delete button on a post
2. Confirm the deletion
3. The post will be removed from the feed

## Environment Variables

Create a `.env` file in the Backend directory with:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/snapshare

# ImageKit Configuration
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Server Configuration
PORT=3000
```

## Installation & Deployment

### Local Development

```bash
# Backend
cd Backend
npm install
npm start

# Frontend (in another terminal)
cd Frontend
npm install
npm run dev
```

### Production Build

```bash
# Frontend
cd Frontend
npm run build

# The dist folder contains the production build
```

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
- **Image Upload Fails**: Check ImageKit credentials and API keys
- **CORS Error**: Verify CORS is enabled in Express app
- **Port Already in Use**: Change the port in server.js or stop the conflicting process

## License

This project is open source and available under the ISC License.

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## Support

For support, questions, or issues, please open an issue in the repository or contact the project owner.

## Future Enhancements

- User authentication and profiles
- Like and comment functionality
- Search and filter posts
- Real-time notifications
- Follow/Unfollow users
- Dark mode support
- Mobile app version

---

## Author

Rafay Ali

**Happy Coding!**
