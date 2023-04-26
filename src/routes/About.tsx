import {Box, Flex, Heading, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react"

const About = () => {
    return (
        <Flex direction={{base: "column", md: "row"}} justify="space-evenly" mx={{base: 2, md: 10}}
              my={{base: 5, md: 10}}>
            <Box flex="1" maxW={{base: "100%", md: "25%"}} mb={{base: 10, md: 0}}>
                <Heading as="h2" size="lg" mb={4}>About Skanderbeg</Heading>
                <Text mb={4}>A</Text>
                <Text mb={4}>B:</Text>
                <UnorderedList mb={4}>
                    <ListItem>C</ListItem>
                </UnorderedList>
            </Box>
            <Box flex="1" maxW={{base: "100%", md: "25%"}} mb={{base: 10, md: 0}} ml={{md: 10}}>
                <Heading as="h2" size="lg" mb={4}>Contact with us</Heading>
                <Text mb={4}>If you would like to contact us, ask some questions, suggest something or report some
                    bug, the easiest way to do so is by joining our Discord available <Link
                        href="https://discord.gg/uzkMPjc">here</Link>.</Text>
                <Text mb={4}>If you would be interested in supporting us with maintaining the server etc. we have a
                    Patreon page <Link href="http://patreon.com/skanderbeg">here</Link>.</Text>
                <Text mb={4}>This project is now in the early stages of being
                    released as open-source. You can access the project's code here:
                    <Link href="https://github.com/SkanderForge">here</Link>.</Text>
            </Box>
        </Flex>
    )
}
export default About;