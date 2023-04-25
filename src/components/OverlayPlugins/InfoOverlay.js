import React from "react";
// import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import Overlay from "../OverlayPlugins/Overlay";
// import ReactMarkdown from "react-markdown";
// import aboutPath from "../../markdown/AboutNotio.md";

const InfoOverlay = (props) => {
  const overlayId = "infoOverlay";
  return (
    <React.Fragment>
      <Overlay overlayId={overlayId} visible={true} close={props.onClickCloseHandler}>
        <div className="tabs-wrapper">
          <Tabs defaultActiveKey="Howto" id="controlled-tab-example">
            <Tab eventKey="Howto" title="How to">
              <div>
                <Card>
                  <Card.Body>
                    <Card.Title>How to use Notio</Card.Title>
                    <Card.Text>
                      Present the foundation of musical theory for a piece of music or as part of a
                      course, copy it and send the link to students, pupils or other interested, and
                      learn and play through the interactive piano.
                    </Card.Text>
                    <Card.Text>
                      In this how to guide, you can read about how to:<br></br>
                      <Card.Link href="#play-piano">Play on the piano</Card.Link>
                      <br></br>
                      <Card.Link href="#make-configuration">Make your own configuration</Card.Link>
                      <br></br>
                      <Card.Link href="#using-video">Using video</Card.Link>
                      <br></br>
                      <Card.Link href="#share-setup">Share your setup</Card.Link>
                      <br></br>
                      <Card.Link href="#custom-scale">Create a custom scale</Card.Link>
                      <br></br>
                      <Card.Link href="#suggest-improvement">Suggest improvements</Card.Link>
                    </Card.Text>
                    <Card.Text>Best of luck on your musical adventure!</Card.Text>
                    <ListGroup>
                      <ListGroupItem>
                        <Card.Body id="play-piano">
                          <Card.Text>
                            <strong>Playing the piano</strong>
                            <br></br>
                            The coloured keys and piano are playable both by clicking and using the
                            keyboard.<br></br>
                            Only nodes that are part of the scale can make a sound!<br></br>
                            To use the right hand, use the keys FGHJ... (on a QWERTY keyboard) to
                            play<br></br>
                            To use the left hand (in non-extended mode), the keys are ZXC ASD QWE{" "}
                            <br></br>
                            In extended mode, the right hand starts from ASDF... and the left hand
                            is disabled.<br></br>
                            The left hand can be transposed using the arrow keys up and down
                            <br></br>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="make-configuration">
                          <Card.Text>
                            <strong>Configuring the scale</strong>
                            <br></br>
                            You can make your own unique configuration and easily share it (see{" "}
                            <a href="#share-setup">Sharing your setup</a>)<br></br>
                            To configure the scale, use the top menu. The possible configurations
                            are:<br></br>
                            <strong>show keyboard</strong>: turn the piano on/off (the coloured
                            notes are still playable!)<br></br>
                            <strong>extended keyboard</strong>: Make the piano fill up 2 octaves
                            (and disable left hand play, see{" "}
                            <a href="#play-piano">Play the piano</a>)<br></br>
                            <strong>sound</strong>: Make the piano use a different sound (presently
                            not available sadly)<br></br>
                            <strong>notation</strong>: Show the chosen notation of the notes used in
                            the scale<br></br>
                            <strong>root</strong>: Choose the base root of the scale. This will be
                            the note played on F (see <a href="#play-piano">Play the piano</a>)
                            <br></br>
                            <strong>scale</strong>: Choose the scale, or create a custom one! (see{" "}
                            <a href="#custom-scale">Create a custom scale</a>)<br></br>
                            <strong>clefs</strong>: Choose the clef the scale uses, or disable it
                            entirely<br></br>
                            <strong>video player</strong> Use the video player. For more details,
                            see <a href="#using-video">Using video</a>
                            <br></br>
                            <strong>share this setup</strong> Share the setup through a url. For
                            more details see <a href="#share-setup">Share your setup</a>
                            <br></br>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body>
                          <Card.Text id="using-video">
                            <strong>Using Videos</strong>
                            <br></br>
                            The Notio video player can be used to play along like the old Aebersold
                            records. Notio also remembers your video choice when sharing with
                            others, so you can set it up like you want to<br></br>
                            The Video Player consist of 3 seperate tabs:<br></br>
                            <strong>Enter url</strong> Search on Youtube to find a tune that you
                            want to practice to, copy paste the url into the form and hit "Enter".{" "}
                            <br></br>
                            <strong>Player</strong> is where you see the video.
                            <strong>Tutorials</strong> are a collection of small examples of how
                            Notio can be used
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="share-setup">
                          <Card.Text>
                            <strong>Sharing your setup</strong>
                            <br></br>
                            When you have created a unique setup in Notio (see{" "}
                            <a href="#make-configuration">Make your own configuration</a>) you can
                            then share it to anybode.<br></br>
                            Simply press the button "Share this setup", then press "create share
                            link" and send it to anyone you like.<br></br>
                            Those who open the link will get an exact copy of your setup, with piano
                            settings, scale and video included!
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="custom-scale">
                          <Card.Text>
                            <strong>Create custom scale</strong>
                            <br></br>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="suggest-improvement">
                          <Card.Text>
                            <strong>Suggest improvements</strong>
                            <br></br>
                            If you have any suggestions, you can write to:
                            suggestionsnotio@gmail.com <br></br>
                            Notio is a development project intended to broaden the horizon of how
                            music, teaching and technology can work together to enhance the music
                            education field (see About)<br></br>
                            As such we want your feedback to further this vision. Thank you for
                            using Notio!
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
                <Card id="about">
                  <Card.Body>
                    <Card.Title>About Notio</Card.Title>
                    <ListGroup>
                      <ListGroupItem>
                        <Card.Body>
                          <Card.Text>
                            <b>The Notio project</b> focuses on researching and developing 
                            new pedagogies and technologies that support processes 
                            of learning to actively theorise and conceptualise music. 
                            We believe that having the possibility to explore and 
                            create music is central to those processes. With this in mind, 
                            we have designed the Notio digital environment as a flexible, 
                            open resource for teachers and learners. 
                          </Card.Text>
                          <Card.Text>
                            This browser-based application can be used together with music videos, 
                            tutorials, or backing tracks; to play along and improvise, 
                            and as support for writing, analysing and transcribing music. 
                            Notio also works well for ear training and for memorising scales 
                            and modes in different languages. By curating material that 
                            fits the learning goals and needs of groups and individual students, 
                            teachers can use the digital resource from beginner level to 
                            advanced professional level. Notio is public and free for anyone to use. 
                            For an optimal user experience, please open the application in Chrome 
                            on a laptop or desktop computer. 
                          </Card.Text>
                          <Card.Text>
                            We thank the funders of the project:  
                            The Åbo Akademi University Foundation (Stiftelsen för Åbo Akademi)
                            The Swedish Cultural Foundation in Finland (Svenska kulturfonden)
                            Högskolestiftelsen i Österbotten
                            The association Föreningen Konstsamfundet r.f.
                            Ålands musikinstitut
                            Vasa övningsskola
                          </Card.Text>
                          <Card.Text>
                            Many thanks also to all our colleagues and friends who keep providing feedback!
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <b>Project Team</b>
                        <Card.Body>
                          <Card.Text>
                            Dr. Cecilia Björk, Assistant Professor, University of Music and Performing Arts Vienna, Austria
                          </Card.Text>
                          <Card.Text>
                            Mats Granfors, Senior Lecturer, Novia University of Applied Science, Finland
                          </Card.Text>
                          <Card.Text>
                            Dr. Alex Ruthmann, Associate Professor, New York University Steinhardt School of Education, Culture, and Human Development, USA
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <b>Developers currently working at Notio</b>
                        <Card.Body>
                          <Card.Text>
                            Jakob Skov Søndergård(Denmark).
                          </Card.Text>
                          <Card.Text>
                            Martin Bruun Michaelsen(Denmark)
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <b>Developers that have contributed to Notio</b>
                        <Card.Body>
                          <Card.Text>
                          Muriel Colagrande (France)
                          </Card.Text>
                          <Card.Text>
                          Martin Desrumaux (France)
                          </Card.Text>
                          <Card.Text>
                          Marcus Gustafsson (Finland)
                          </Card.Text>
                          <Card.Text>
                          Joachim Högväg (Finland)
                          </Card.Text>
                          <Card.Text>
                          Joachim Majors (Finland)
                          </Card.Text>
                          <Card.Text>
                          Guergana Tzatchkova(Germany/Mexico)
                          </Card.Text>
                          <Card.Text>
                          Emilie Zawadzki (France)
                          </Card.Text>                          
                        </Card.Body>
                      </ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            </Tab>
            <Tab eventKey="FAQ" title="FAQ">
              <div>
                <Card>
                  <Card.Body>
                    <Card.Title>Frequently Asked Questions (FAQ)</Card.Title>
                    <ListGroup>
                      <ListGroupItem>
                        <Card.Body>
                          <Card.Title>Do you have a colourblind mode?</Card.Title>
                          <Card.Text>
                            Yes! If you press 1,2,3,4 or 5 it will change between the different
                            colour modes.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body>
                          <Card.Title>Is MIDI planned for Notio?</Card.Title>
                          <Card.Text>
                            Yes, it is planned that you can use your MIDI devices to play in Notio.
                            <br></br>
                            It is however not a primary goal as of now, but we hope to have it ready
                            during 2023 at the latest.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default InfoOverlay;
