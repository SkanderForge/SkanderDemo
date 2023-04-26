import {Box, Flex, Heading, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react"

const About = () => {
    return (
        <Flex direction={{base: "column", md: "row"}} justify="space-between" mx={{base: 2, md: 10}}
              my={{base: 5, md: 10}}>
            <Box flex="1" maxW={{base: "100%", md: "25%"}} mb={{base: 10, md: 0}}>
                <Heading as="h2" size="lg" mb={4}>About Skanderbeg</Heading>
                <Text mb={4}>Skanderbeg is a web-based save parser & analyzer for Paradox Interactive's Grand
                    Strategy Games built on the Clausewitz engine (currently only Europa Universalis IV is
                    supported). Upon uploading the save to the server, you get access to a fancy interactive map and
                    a detailed ledger, which includes some of the data that you can already view in-game, but also
                    some unique.</Text>
                <Text mb={4}>Some of the most interesting features of EU4 save analyzer include:</Text>
                <UnorderedList mb={4}>
                    <ListItem>Casualties map mode showing how many soldiers lost their lives in a given
                        province</ListItem>
                    <ListItem>Improvement map mode, showing the growth of each province in the world</ListItem>
                    <ListItem>Export map to a .png file which has higher resolution than in-game map and includes
                        borders of provinces</ListItem>
                </UnorderedList>
                <Text mb={4}>Ledger:</Text>
                <UnorderedList mb={4}>
                    <ListItem>Military ledger, showing how each country's army compares to others quality and
                        quantity wise. This ledger utilizes a special system to measure country's army quality
                        called effective discipline. You can read more about it in the documentation.</ListItem>
                    <ListItem>Wars ledger, showing history of all wars and battles, including information such as
                        casualties, troops used etc.</ListItem>
                    <ListItem>Efficiency metrics sub-ledger, showing you how efficiently you built your
                        country</ListItem>
                    <ListItem>Mana and ducats usage ledgers, showing where each country has spent its monarch points
                        and money.</ListItem>
                </UnorderedList>
                <Text mb={4}><b>Important note:</b> Skanderbeg is NOT in any way related to Paradox Interactive or
                    its Clausewitz Engine.</Text>
            </Box>
            <Box flex="1" maxW={{base: "100%", md: "25%"}} mb={{base: 10, md: 0}} ml={{md: 10}}>
                <Heading as="h2" size="lg" mb={4}>Contact with us</Heading>
                <Text mb={4}>If you would like to contact us, ask some questions, suggest something or report some
                    bug, the easiest way to do so is by joining our Discord available <Link
                        href="https://discord.gg/uzkMPjc">here</Link>.</Text>
                <Text mb={4}>If you would be interested in supporting us with maintaining the server etc. we have a
                    Patreon page <Link href="http://patreon.com/skanderbeg">here</Link>.</Text>
            </Box>
        </Flex>
    )
}
export default About;