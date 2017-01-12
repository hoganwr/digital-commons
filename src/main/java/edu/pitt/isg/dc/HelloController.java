package edu.pitt.isg.dc;

import edu.pitt.isg.dc.digital.dap.DapRule;
import edu.pitt.isg.dc.digital.software.Software;
import edu.pitt.isg.dc.digital.software.SoftwareFolder;
import edu.pitt.isg.dc.digital.software.SoftwareRule;
import org.springframework.beans.factory.annotation.Autowired;
import edu.pitt.isg.dc.utils.DigitalCommonsProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Properties;

@Controller
public class HelloController {
 private static String VIEWER_URL = "";
 private static String VIEWER_TOKEN = "";

    static {
        Properties configurationProperties = DigitalCommonsProperties.getProperties();
        VIEWER_URL = configurationProperties.getProperty(DigitalCommonsProperties.LIBRARY_VIEWER_URL);
        VIEWER_TOKEN = configurationProperties.getProperty(DigitalCommonsProperties.LIBRARY_VIEWER_TOKEN);
    }

    @Autowired
    private DapRule dapRule;
    @Autowired
    private SoftwareRule softwareRule;


    @RequestMapping(value = "/home", method = RequestMethod.GET)
    public String hello(Model model) {
        model.addAttribute("dataAugmentedPublications", dapRule.tree());
        model.addAttribute("software", softwareRule.tree());
        model.addAttribute("libraryViewerUrl", VIEWER_URL);
        model.addAttribute("libraryViewerToken", VIEWER_TOKEN);
        return "commons";
    }

    @RequestMapping(value = "/software/{id}", method = RequestMethod.GET)
    public String softwareInfo(Model model, @PathVariable("id") long id) {
        Iterable<SoftwareFolder> tree = softwareRule.tree();

        Software softwareToReturn = new Software();
        for(SoftwareFolder folder : tree) {
            for(Software software : folder.getList()) {
                if(software.getId() == id) {
                    softwareToReturn = software;
                    break;
                }
            }
        }

        model.addAttribute("software", softwareToReturn);    // placeholder for iterable to be returned from DB
        return "softwareInfo";
    }
}
