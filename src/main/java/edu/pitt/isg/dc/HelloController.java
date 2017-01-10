package edu.pitt.isg.dc;

import edu.pitt.isg.dc.digital.AugmentedData;
import edu.pitt.isg.dc.digital.DataAugmentedPublication;
import edu.pitt.isg.dc.digital.Paper;
import edu.pitt.isg.dc.digital.Publication;
import edu.pitt.isg.dc.digital.dap.DapRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
public class HelloController {
    @Autowired
    private DapRule rule;

    @RequestMapping(value = "/home", method = RequestMethod.GET)
    public String hello(Model model, @RequestParam(value="name") String name) {
        //model.addAttribute("dataAugmentedPublications", dummyModels());
        model.addAttribute("dataAugmentedPublications", rule.tree());
        return "commons";
    }

    private List<DataAugmentedPublication> dummyModels() {
        final ArrayList<DataAugmentedPublication> list = new ArrayList<>();
        list.add(dummyDataAugmentedPublication());
        System.out.println(list);
        return list;
    }

    private DataAugmentedPublication dummyDataAugmentedPublication() {
        final DataAugmentedPublication dataAugmentedPublication = new DataAugmentedPublication();
        dataAugmentedPublication.setName("Ebola Cases and Health System Demand in Liberia");
        dataAugmentedPublication.setPaper(dummyPaper());
        dataAugmentedPublication.setData(dummyAugmentedData());
        return dataAugmentedPublication;
    }

    private Paper dummyPaper() {
        final Paper paper = new Paper();
        fillDummyEbola(paper);
        paper.setDoi("10.1371/journal.pbio.1002056");
        paper.setTypeText("Paper");
        paper.setUrl("http://dx.doi.org/10.1371/journal.pbio.1002056");
        return paper;
    }

    private AugmentedData dummyAugmentedData() {
        final AugmentedData data = new AugmentedData();
        fillDummyEbola(data);
        data.setDoi("10.5061/dryad.17m5q");
        data.setTypeText("Dryad Data Package");
        data.setUrl("http://dx.doi.org/10.5061/dryad.17m5q");
        return data;
    }

    private void fillDummyEbola(Publication data) {
        data.setAuthorsText("Drake JM, Kaul RB, Alexander LW, O'Regan SM, Kramer AM, Pulliam JT, Ferrari MJ, Park AW");
        data.setPublicationDateText("1-13-2015");
    }
}
