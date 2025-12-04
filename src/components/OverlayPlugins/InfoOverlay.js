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
      <Overlay
        modalName="help"
        overlayId={overlayId}
        visible={true}
        close={props.onClickCloseHandler}>
        <div className="tabs-wrapper">
          <Tabs defaultActiveKey="Howto" id="controlled-tab-example">
            <Tab eventKey="Howto" title="How to">
              <div>
                <Card>
                  <Card.Body>
                    <Card.Title>How to use Notio</Card.Title>
                    <Card.Text>
                      In this guide, you will find instructions and suggestions on how to:
                    </Card.Text>
                    <Card.Text>
                      <Card.Link href="#play">Play</Card.Link>
                      <br></br>
                      <Card.Link href="#make-configurations">Make configurations</Card.Link>
                      <br></br>
                      <Card.Link href="#explore">Explore</Card.Link>
                      <br></br>
                      <Card.Link href="#using-video">Use videos</Card.Link>
                      <br></br>
                      <Card.Link href="#share-setup">Share your setups</Card.Link>
                      <br></br>
                      <Card.Link href="#listen">Listen</Card.Link>
                      <br></br>
                      <Card.Link href="#create">Create</Card.Link>
                      <br></br>
                      <Card.Link href="#learn">Learn</Card.Link>
                      <br></br>
                      <Card.Link href="#teach">Teach</Card.Link>
                      <br></br>
                      <Card.Link href="#suggest-improvements">Suggest improvements</Card.Link>
                    </Card.Text>
                    <Card.Text>Best of luck on your musical adventure!</Card.Text>
                    <ListGroup>
                      <ListGroupItem>
                        <Card.Body id="play">
                          <b>Play</b>
                          <Card.Text>
                            The coloured “xylophone” keys and the piano are playable both by clicking and by using the computer keyboard.<br/>
                            Only notes that are part of the scale can make a sound!<br/>
                            <br/>
                            On the computer keyboard:<br/>
                            To play the notes of the scale from the root, start with the keys FGHJ.<br/>
                            To add a bass line (in non-extended mode), the keys are, depending on your keyboard:<br/>
                            ZXC ASD QWE (QWERTY)<br/>
                            WXC QSD AZE (AZERTY)<br/>
                            YXC ASD QWE (QWERTZ)<br/>
                            The bass line can be moved to another octave using the arrow keys up and down.<br/>
                            <br/>
                            In extended mode, you can start playing in the octave below the root by using ASDF/QSDF and continue three notes into the next octave by using<br/>
                            ‘[=  (QWERTY)<br/>
                            ÄÅ´ (QWERTY Nordic)<br/>
                            ù^=  (AZERTY)<br/>
                            ÄÜ´ (QWERTZ)<br/>
                            The bass line is disabled in extended mode. <br/>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="make-configurations">
                          <b>Make configurations</b>
                          <Card.Text>
                            You can make your own unique configurations and share them easily through the top menu.<br/>
                            The possible configurations are:<br/>
                            <b>Show keyboard</b>: Turn the piano on/off (the xylophone is still playable).<br/>
                            <b>Extended keyboard</b>: Extend to 2 octaves (this disables bass line).<br/>
                            <b>Sound</b>: Choose from a sound menu (more options coming!)<br/>
                            <b>Notation</b>: Show the names of the notes used in the scale in different languages and in the relative system. Show scale steps and extensions.<br/>
                            <b>Root</b>: Choose the root of the scale (DO). This will be the note that is played on the F of the computer keyboard and it will be displayed in red both on the xylophone and the piano keyboard.<br/>
                            <b>Scale</b>: Choose a scale or create your own!<br/>
                            <b>Clefs</b>: Choose the clef to be used, or disable the staff entirely.<br/>
                            <b>Video player</b>: Open and use the video player.<br/>
                            <b>Share this setup</b>: Share the setup you have created through a URL link.<br/>
                            <br/>
                            You can change the colour scheme by pressing the numbers<br/>
                            1: Greyscale<br/>
                            2: Protanopia<br/>
                            3: Deuteranopia<br/>
                            4: Tritanopia<br/>
                            5: Variation 1<br/>
                            6: The Original Notio<br/> 
                            7: Variation 2<br/>
                            8: Variation 3<br/>
                            9: Pastel<br/>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="explore">
                          <b>Explore</b>
                          <Card.Text>
                            Set up Notio for different keys and modes, try them out, improvise. Enter your favourite music or backing track in the video player, play along, compare sounds, develop a combined aural and visual understanding of musical concepts and structures, generate theory for music that you are curious about… 
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="using-video">
                          <b>Use videos</b>
                          <Card.Text>
                            The video player has three separate tabs:<br/>
                            <b>Enter URL</b> Choose a video that you want to use for learning or practising. Copy-paste the URL into the form, then press Enter.<br/>
                            <b>Player</b> is where you see the video.<br/>
                            <b>Tutorials</b> is a collection of short examples of how Notio can be used.<br/>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="share-setup">
                          <b>Share your setups</b>
                          <Card.Text>
                            When you have created a setup in Notio, you can save a link to it. Simply press the button "Share this setup", then press “Copy link”. You can share your link or a collection of copied links with anyone. For example, as a teacher, you can create a list of setups for your students to work through. Those who open the link will get an exact copy of your setup: all settings including the video URL will be included.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="listen">
                          <b>Listen</b>
                          <Card.Text>
                            Use the keyboard and the video player to find the specific sounds of different scales, modes, keys, and tonalities. Use the Notation menu for ear training.  Become familiar with the sounds of extensions: the connection between 2nd and 9th, 4th and 11th, 6th and 13th.
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="create">
                          <b>Create</b>
                          <Card.Text>
                            Use Notio as support for your own songwriting and musical creativity: find inspiration in music videos, play around with ideas, get help with notation for something cool you found while improvising.<br/>
                            <br/>
                            You can also create your own scale! In the Scale menu, select Customize. A pop-up window with checkboxes will appear. Choose the notes you want in your scale, give it a name, then press Submit, then OK. Your scale will now appear in the Scale menu. Refresh the page to remove it.<br/>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="learn">
                          <b>Learn</b>
                          <Card.Text>
                            Develop a combined aural and visual understanding of musical concepts and structures. Use Notio as support for your learning with video tutorials. Generate theory for music that you are curious about. Practice solmisation with relative note names. <br/>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="teach">
                          <b>Teach</b>
                          <Card.Text>
                            Encourage your students to explore the connections between sound, structure, and notation. Introduce elements of theory in a piece of music or as part of a course. Ask students to select music for listening and playing together, discuss what makes the music sound the way it sounds. Use Notio as support for songwriting sessions. Curate material for play-along, improvisation, and analysis<br/>
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body id="suggest-improvements">
                          <b>Suggest improvements</b>
                          <Card.Text>
                            Notio is a research and development project intended to broaden the horizon of how educational research and technology can enhance musical teaching and learning (see About). We welcome your feedback on how to further this vision. If you have any suggestions, please write to us at suggestionsnotio@gmail.com<br/>
                            <br/>
                            Thank you for using Notio!
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
                            open resource for teachers and learners.<br/>
                            <br/>
                            This browser-based application can be used together with music videos, 
                            tutorials, or backing tracks; to play along and improvise, 
                            and as support for writing, analysing and transcribing music. 
                            Notio also works well for ear training and for memorising scales 
                            and modes in different languages. By curating material that 
                            fits the learning goals and needs of groups and individual students, 
                            teachers can use the digital resource from beginner level to 
                            advanced professional level. Notio is public and free for anyone to use. 
                            For an optimal user experience, please open the application in Chrome 
                            on a laptop or desktop computer.<br/>
                            <br/>
                            We thank the funders of the project:  <br/>
                            The Åbo Akademi University Foundation (Stiftelsen för Åbo Akademi)<br/>
                            The Swedish Cultural Foundation in Finland (Svenska kulturfonden)<br/>
                            Högskolestiftelsen i Österbotten<br/>
                            The association Föreningen Konstsamfundet r.f.<br/>
                            Ålands musikinstitut<br/>
                            Vasa övningsskola<br/>
                            <br/>
                            Many thanks also to all our colleagues and friends who keep providing feedback!
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <b>Project Team</b>
                        <Card.Body>
                          Dr. Cecilia Björk, Assistant Professor, University of Music and Performing Arts Vienna, Austria<br/>
                          <br/>
                          Mats Granfors, Senior Lecturer, Novia University of Applied Science, Finland<br/>
                          <br/>
                          Dr. Alex Ruthmann, Associate Professor, New York University Steinhardt School of Culture, Education, and Human Development, USA<br/>
                          <br/>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <b>Developers currently working on Notio</b>
                        <Card.Body>
                          Jakob Skov Søndergård (Denmark)<br/>
                          <br/>
                          Martin Bruun Michaelsen (Denmark)<br/>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <b>Developers who have contributed to Notio</b>
                        <Card.Body>
                          Muriel Colagrande (France)<br/>
                          <br/>
                          Martin Desrumaux (France)<br/>
                          <br/>
                          Marcus Gustafsson (Finland)<br/>
                          <br/>
                          Joachim Högväg (Finland)<br/>
                          <br/>
                          Joachim Majors (Finland)<br/>
                          <br/>
                          Guergana Tzatchkova (Germany/Mexico)<br/>
                          <br/>
                          Emilie Zawadzki (France)<br/>                       
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
                    <Card.Title>FAQ</Card.Title>
                    <ListGroup>
                      <ListGroupItem>
                        <Card.Body>
                        <b>I would like to change the colours. Is that possible?</b>
                          <Card.Text>
                            Yes! There are currently seven different setups that you can choose between by pressing the numbers 1–7 on your computer keyboard (see "How to"). We are currently working on an integrated colour picker that will allow you to customise the colour scheme. Please feel free to suggest a setup that you like!
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body>
                        <b>Does Notio work with MIDI?</b>
                          <Card.Text>
                            Not yet, but that is one of our longterm goals. 
                          </Card.Text>
                        </Card.Body>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Card.Body>
                        <b>Is Notio available for touchscreen and handheld devices?</b>
                          <Card.Text>
                            Also not yet, but that is our next project! 
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
