import React, { Component } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      query: '',
      page: 1,
      selectedImage: null,
      isLoading: false,
      isSearching: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { query, page } = this.state;
    const apiKey = '42074727-f1151295fbcc10abbb4f66773';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&per_page=12&page=${page}`;

    this.setState({ isLoading: true });

    try {
      const response = await axios.get(url);

      // Verifică și elimină imaginile duplicate
      const newImages = response.data.hits.filter(
        newImage => !this.state.images.some(image => image.id === newImage.id)
      );

      this.setState(prevState => ({
        // Actualizează lista de imagini cu cele noi, fără duplicate
        images: page === 1 ? newImages : [...prevState.images, ...newImages],
        page: prevState.page + 1,
        isSearching: false,
      }));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearch = query => {
    const searchTerm = query.trim() === '' ? 'default' : query;
    this.setState(
      { query: searchTerm, page: 1, images: [], isSearching: true },
      this.fetchImages
    );
  };

  handleImageClick = image => {
    this.setState({ selectedImage: image });
  };

  closeModal = () => {
    this.setState({ selectedImage: null });
  };

  render() {
    const { images, selectedImage, isLoading } = this.state;

    return (
      <div>
        <Searchbar onSearch={this.handleSearch} />
        <ImageGallery images={images} onImageClick={this.handleImageClick} />
        {isLoading && <Loader />} {/* Afișează Loader-ul peste imagini */}
        {!isLoading && images.length > 0 && (
          <Button onClick={() => this.fetchImages()} />
        )}
        {selectedImage && (
          <Modal image={selectedImage} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}

export default App;
