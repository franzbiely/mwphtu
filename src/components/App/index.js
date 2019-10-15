import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ModalVideo from 'react-modal-video'
import 'react-modal-video/css/modal-video.min.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: "How to Use",
      description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae tincidunt ipsum, sit amet sodales eros. Praesent ac condimentum magna. Sed mollis placerat urna, eu tincidunt nulla fringilla non. Pellentesque in nisl nec dolor dapibus ornare non commodo mauris. Aenean mollis magna eu massa egestas, a efficitur augue volutpat. Vestibulum sed metus ut justo mattis posuere rutrum sed dui. Mauris fermentum est maximus pharetra fringilla. Nunc accumsan tortor urna, vitae rutrum lorem feugiat nec. Vestibulum vel viverra massa. Nam a justo consectetur, rutrum enim vitae, pharetra erat. Nunc id pellentesque mauris. Aliquam ut sem et turpis bibendum lacinia vitae vitae quam.</p>" +
        "<p>Pellentesque eu lacus sit amet ex auctor malesuada. Morbi finibus erat leo, a iaculis urna dignissim id. Proin auctor diam imperdiet tempus condimentum. Donec id quam et metus consectetur malesuada. Suspendisse facilisis ligula pellentesque ex commodo, et tempus ante mollis. Maecenas posuere nibh ante, eu ultricies eros vehicula et. Quisque viverra nulla quam, ut tempus odio consectetur sit amet.</p>",
      videos_header: 'How to Videos',
      videos: [],
      video_config: {
        responsive: {
          superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
          },
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
          }
        }
      },
      isOpen: false,
      books_header: 'Our Books',
      books: [],
      selectedVideo : ''
    }

    this.openModal = this.openModal.bind(this)
  }

  componentDidMount() {
    // Fetch Content + Videos 
    fetch("http://stefano.local/wp-json/wp/v2/pages/74")
      .then(res => res.json())
      .then((result) => {
        this.setState({
          title: result.title.rendered,
          description: result.content.rendered.substring(0,
            result.content.rendered.indexOf('<h3>How to Videos</h3>')
          ),
          videos: result.content.rendered
            .substring(result.content.rendered.indexOf('<figure'),
              result.content.rendered.length)
            .match(/embed\/(.*)\?/g)
            .map(i => i.substring(i.lastIndexOf('/') + 1, i.lastIndexOf('?'))),
          cta: result.content.rendered
            .substring(result.content.rendered.indexOf('wp-block-separator"/>')+21, result.content.rendered.length)
        })
      })

    // Fetch Books
    fetch("http://stefano.local/wp-json/wp/v2/pages/81")
      .then(res => res.json())
      .then((result) => {
        this.setState({
          books: result.content.rendered.split("<hr class=\"wp-block-separator\"\/>")
        })
      })
  }
  openModal(selectedVideo) {
    this.setState({ selectedVideo, isOpen : true })
  }
  render() {
    return (
      <div className="HowToUseApp">
        <header className="App-header">
          <h2 className="page-header">{this.state.title}</h2>
          <div className="description" dangerouslySetInnerHTML={{ __html: this.state.description }} />
        </header>
        <section className="videos">
          <h3>{this.state.videos_header}</h3>
          <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId={this.state.selectedVideo} onClose={() => this.setState({ isOpen: false })} />
          <Carousel {...this.state.video_config}>
            {this.state.videos.map( (item, key) =>
            <div>
              <span class="playbutton"></span>
              <img key={key} className="video-thumb" onClick={() => this.openModal(item)} src={'http://img.youtube.com/vi/' + item + '/0.jpg'} />
            </div>
              
            )}
          </Carousel>
        </section>
        <section className="call-to-action" dangerouslySetInnerHTML={{__html:this.state.cta}}></section>
        <section className="books">
          <h3>{this.state.books_header}</h3>
          <ul>
            {this.state.books.map((item, key) =>
              <li key={key}>
                <div className="book" dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            )}
          </ul>
        </section>
      </div>
    );
  }
}

export default App;
