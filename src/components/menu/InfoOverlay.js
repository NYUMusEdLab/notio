import React from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import Overlay from "./Overlay";
// import ReactMarkdown from "react-markdown";
// import aboutPath from "../../markdown/AboutNotio.md";

const InfoOverlay = (props) => {
  // const urlInputRef = useRef();
  // const [post, setPost] = useState(" ");

  // const [playing, setPlaying] = useState(false);
  // const [videoUrl, setVideoUrl] = useState(props.videoUrl);
  //TODO: try to import the .md file to auto generate the layout of the infotabs
  // const myfile = require("AboutNotio.md");

  // const file = new File(aboutPath);

  // const reader = new FileReader();
  // useEffect(() => {
  //   fetch("../../markdown/aboutNotio.md")
  //     .then((res) => {
  //       fetch(res.default)
  //         .then((res) => res.text())
  //         .then((res) => setPost(res))
  //         .catch((err) => console.error(err));
  //     })
  //     .then((err) => console.error(err));
  // });

  // const handleFileRead = (e) => {
  //   fetch(myfile)
  //     .then((res) => res.text())
  //     .then((post) => setPost(post));
  //   aboutString = post;
  //   console.log(aboutString);
  // };
  // let aboutString;
  // reader.onloadend = handleFileRead;
  // reader.readAsText(about);
  // reader.readAsText('../../markdown/aboutNotio.md',"utf8",(err,contents)=>{
  //   aboutString = {content: contents ? contents : "no contents"}
  // })

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   setVideoUrl(event.target.elements[0].value);
  //   props.handleChangeVideoUrl(event.target.elements[0].value);
  //   // setActiveTab("playlist");
  // };

  // //this can be used if we make the tabs controlled
  // const handleSelect = (key) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())

  //   if (key === "playlist") {
  //     setActiveTab("playlist");
  //     // this.setState({ activeTab: "playlist" });
  //   }
  //   if (key === "change_video") {
  //     setActiveTab("change_video");
  //     //   this.setState({ activeTab: "change_video" });
  //   }
  // };

  // const playerOnReady = (event) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())
  //   // setPlayerIsReady(false);
  //   setPlaying(true);
  // };

  // const resetVideoUrl = (event) => {
  //   setVideoUrl(props.resetVideoUrl);
  //   // setActiveTab("playlist");
  //   props.handleResetVideoUrl();
  // };

  return (
    <React.Fragment>
      {/* <Overlay visible={show} key={videoUrl}> */}
      <Overlay visible={true}>
        <div className="tabs-wrapper">
          {/* <Tabs defaultActiveKey="playlist" activeKey={state.activeTab} onSelect={handleSelect}  id="controlled-tab-example"> */}
          {/* <Tabs defaultActiveKey="playlist" activeTab={activeTab} id="controlled-tab-example"> */}
          <Tabs defaultActiveKey="Howto" id="controlled-tab-example">
            <Tab eventKey="Howto" title="How to">
              <div>
                <Card>
                  <Card.Body>
                    <Card.Title>How to use Notio</Card.Title>
                    <Card.Text>
                      {/* <Button onClick={handleFileRead} title="Read" />
                      {<ReactMarkdown children={post} />} */}
                      The menu: Notation:, Root, Scale, Clefs Videoplayer,
                    </Card.Text>
                    <ListGroup>
                      <ListGroupItem>
                        Share:
                        <Card.Body>
                          <Card.Text>
                            Sharing: You create a unique setup in Notio when adjusting the
                            particular scale, selecting a video url, setting the root note and more.
                            This setup can be shared to other people using the "Share this setup"
                            button and copying the url. When this url is visited, the Notio setup
                            will be persisted connected to that particular url.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        Playable keys:
                        <Card.Body>
                          <Card.Text>
                            The colored stripes: can be played they correspond to a piano keyboard,
                            and can be played using the mouse, or the qwerty keyboard.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        Select scale:
                        <Card.Body>
                          <Card.Text>
                            The scale menu can be used to select different standard scales, It can
                            also be used to create custom scales.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        Notation:
                        <Card.Body>
                          <Card.Text>
                            Notio is created based on the .....stone that was used to breack the
                            code to read Hieroglyphs. The notation menu can be used to display
                            notenames using the different western nototion systems.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        Video player:
                        <Card.Body>
                          <Card.Text>
                            The Notio video player can be used to play along like the old Aebersold
                            records. Search on Youtube to find a tune that you want to practice to,
                            copy paste the url into Notio, and share the setup with your friends.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
              <p></p>
            </Tab>
            <Tab eventKey="About" title="About">
              <div>
                <Card>
                  <Card.Body>
                    <Card.Img variant="top" src="https://i.ibb.co/RHDjH85/notio-logo.png" />
                    <Card.Title>About Notio</Card.Title>
                    <ListGroup>
                      <ListGroupItem>
                        The idea behind Notio.
                        <Card.Body>
                          <Card.Text>
                            The Notio Project focuses on developing new pedagogies and technologies
                            for improving the teaching of music theory together within the creative
                            music practices of songwriting and improvisation to improve music
                            education in schools in Finland. This project is funded as a Bridging
                            the Theory and Practice of Music through Educational Research and
                            Technology research grant from the Åbo Academy University Foundation
                            (Finland). The MusEDLab is collaborating with PI Cecilia Björk (Åbo
                            Academy), Mats Granfors (Novia University of Applied Sciences), and Jan
                            Jansson (Vasa Övningsskola).
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        Developers currently working at Notio.
                        <Card.Body>
                          <Card.Text>
                            Jakob Skov Søndergård(Denmark), Martin Bruun Michaelsen(Denmark).
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        Developers that have contributed to Notio.
                        <Card.Body>
                          <Card.Text>
                            Emilie Zawadzki(France),Guergana Tzatchkova(Germany),Martin
                            Desrumaux(France)
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            </Tab>
            <Tab eventKey="InstructVideo" title="Instruction Videos">
              <Card>
                <Card.Body>
                  <ListGroup>
                    <ListGroupItem>
                      <ReactPlayer
                        className="react-player"
                        // playing={playing}
                        width="100%"
                        height="100%"
                        url={"https://youtu.be/dkIdl51TBXA"}
                        controls={true}
                        // onReady={playerOnReady}
                      />
                    </ListGroupItem>

                    <ListGroupItem>
                      <ReactPlayer
                        className="react-player"
                        // playing={playing}
                        width="100%"
                        height="100%"
                        url={"https://youtu.be/0z88NcJy8MQ"}
                        controls={true}
                        // onReady={playerOnReady}
                      />
                    </ListGroupItem>
                    <ListGroupItem>
                      <ReactPlayer
                        className="react-player"
                        // playing={playing}
                        width="100%"
                        height="100%"
                        url={"https://youtu.be/RuBru-zqINU"}
                        controls={true}
                        // onReady={playerOnReady}
                      />
                    </ListGroupItem>
                    <ListGroupItem>
                      <ReactPlayer
                        className="react-player"
                        // playing={playing}
                        width="100%"
                        height="100%"
                        url={"https://youtu.be/Ykgavi2EjZQ"}
                        controls={true}
                        // onReady={playerOnReady}
                      />
                    </ListGroupItem>
                    <ListGroupItem>
                      <ReactPlayer
                        className="react-player"
                        // playing={playing}
                        width="100%"
                        height="100%"
                        url={"https://youtu.be/qoeHCq0N4I0"}
                        controls={true}
                        // onReady={playerOnReady}
                      />
                    </ListGroupItem>
                    <ListGroupItem>
                      <ReactPlayer
                        className="react-player"
                        // playing={playing}
                        width="100%"
                        height="100%"
                        url={"https://youtu.be/t-NUdl19sww"}
                        controls={true}
                        // onReady={playerOnReady}
                      />
                    </ListGroupItem>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default InfoOverlay;
